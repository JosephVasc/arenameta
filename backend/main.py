from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx
import os
from dotenv import load_dotenv
from enum import Enum
from sqlalchemy import create_engine, Column, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

app = FastAPI()

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./arenameta.db')
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class MainCharacter(Base):
    __tablename__ = "main_characters"

    id = Column(String, primary_key=True)  # Battle.net account ID
    battletag = Column(String)
    realm = Column(String)
    name = Column(String)
    game_version = Column(String)
    is_main = Column(Boolean, default=True)

class SocialLinks(Base):
    __tablename__ = "social_links"

    battletag = Column(String, primary_key=True)
    discord = Column(String, nullable=True)
    twitch = Column(String, nullable=True)
    twitter = Column(String, nullable=True)
    youtube = Column(String, nullable=True)
    instagram = Column(String, nullable=True)

# Create tables
Base.metadata.create_all(bind=engine)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GameVersion(str, Enum):
    RETAIL = "retail"
    CLASSIC = "classic"

# Battle.net OAuth configuration
BATTLE_NET_CLIENT_ID = os.getenv('BATTLE_NET_CLIENT_ID')
BATTLE_NET_CLIENT_SECRET = os.getenv('BATTLE_NET_CLIENT_SECRET')
BATTLE_NET_REDIRECT_URI = 'http://localhost:3000/auth/callback'
BATTLE_NET_AUTH_URL = 'https://oauth.battle.net/authorize'
BATTLE_NET_TOKEN_URL = 'https://oauth.battle.net/token'
BATTLE_NET_API_URL = 'https://us.api.blizzard.com'
BATTLE_NET_USERINFO_URL = 'https://us.battle.net/oauth/userinfo'
BATTLE_NET_REGION = 'us'
BATTLE_NET_SCOPE = 'wow.profile openid'

# Namespace configuration
NAMESPACES = {
    GameVersion.RETAIL: 'profile-us',
    GameVersion.CLASSIC: 'profile-classic-us'
}

# Dynamic namespace configuration for game data
DYNAMIC_NAMESPACES = {
    GameVersion.RETAIL: 'dynamic-us',
    GameVersion.CLASSIC: 'dynamic-classic-us'
}

# Season configuration
SEASONS = {
    GameVersion.RETAIL: 33,
    GameVersion.CLASSIC: 1
}

async def get_battle_net_token():
    """Get a Battle.net API token using client credentials"""
    if not BATTLE_NET_CLIENT_ID or not BATTLE_NET_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Battle.net credentials not configured")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                BATTLE_NET_TOKEN_URL,
                data={
                    'grant_type': 'client_credentials',
                    'client_id': BATTLE_NET_CLIENT_ID,
                    'client_secret': BATTLE_NET_CLIENT_SECRET
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to get Battle.net token")
            
            data = response.json()
            return data['access_token']
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting Battle.net token: {str(e)}")

class OAuthRequest(BaseModel):
    state: str

class OAuthCallback(BaseModel):
    code: str
    state: str

class CharacterRequest(BaseModel):
    realm: str
    name: str
    game_version: GameVersion

class SetMainCharacterRequest(BaseModel):
    realm: str
    name: str
    game_version: GameVersion

class SocialLinksRequest(BaseModel):
    discord: Optional[str] = None
    twitch: Optional[str] = None
    twitter: Optional[str] = None
    youtube: Optional[str] = None
    instagram: Optional[str] = None

@app.post('/api/auth/battlenet')
async def get_battlenet_auth_url(request: OAuthRequest):
    if not BATTLE_NET_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Battle.net client ID not configured")
    
    auth_url = f"{BATTLE_NET_AUTH_URL}?client_id={BATTLE_NET_CLIENT_ID}&redirect_uri={BATTLE_NET_REDIRECT_URI}&response_type=code&state={request.state}&scope={BATTLE_NET_SCOPE}"
    return {"url": auth_url}

@app.post('/api/auth/battlenet/callback')
async def handle_battlenet_callback(callback: OAuthCallback):
    if not BATTLE_NET_CLIENT_ID or not BATTLE_NET_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Battle.net credentials not configured")
    
    try:
        # Exchange code for access token
        async with httpx.AsyncClient() as client:
            print(f"Exchanging code for token with redirect URI: {BATTLE_NET_REDIRECT_URI}")
            token_response = await client.post(
                BATTLE_NET_TOKEN_URL,
                data={
                    'grant_type': 'authorization_code',
                    'client_id': BATTLE_NET_CLIENT_ID,
                    'client_secret': BATTLE_NET_CLIENT_SECRET,
                    'code': callback.code,
                    'redirect_uri': BATTLE_NET_REDIRECT_URI,
                    'scope': BATTLE_NET_SCOPE
                }
            )
            
            if token_response.status_code != 200:
                error_detail = f"Token exchange failed: {token_response.text}"
                print(error_detail)
                raise HTTPException(status_code=token_response.status_code, detail=error_detail)
            
            token_data = token_response.json()
            
            if 'access_token' not in token_data:
                error_detail = "No access token in response"
                print(error_detail)
                raise HTTPException(status_code=400, detail=error_detail)
            
            # Get user profile
            print("Fetching user profile...")
            profile_response = await client.get(
                BATTLE_NET_USERINFO_URL,
                headers={
                    'Authorization': f"Bearer {token_data['access_token']}"
                }
            )
            
            if profile_response.status_code != 200:
                error_detail = f"Profile fetch failed: {profile_response.text}"
                print(error_detail)
                raise HTTPException(status_code=profile_response.status_code, detail=error_detail)
            
            profile_data = profile_response.json()
            print(f"Successfully authenticated user: {profile_data}")
            
            # Extract battletag from the profile data
            battletag = profile_data.get('battletag')
            if not battletag:
                raise HTTPException(status_code=400, detail="No battletag found in profile data")
            
            return {
                'access_token': token_data['access_token'],
                'profile': {
                    'id': profile_data.get('id'),
                    'battletag': battletag
                }
            }
    except httpx.HTTPError as e:
        error_detail = f"HTTP error occurred: {str(e)}"
        print(error_detail)
        raise HTTPException(status_code=500, detail=error_detail)
    except Exception as e:
        error_detail = f"Unexpected error: {str(e)}"
        print(error_detail)
        raise HTTPException(status_code=500, detail=error_detail)

@app.get('/api/account/profile')
async def get_account_profile(req: Request):
    """Get account profile and character list for both retail and classic"""
    access_token = req.headers.get('Authorization', '').replace('Bearer ', '')
    if not access_token:
        raise HTTPException(status_code=401, detail="No access token provided")

    try:
        async with httpx.AsyncClient() as client:
            # Get retail profile
            retail_response = await client.get(
                f"{BATTLE_NET_API_URL}/profile/user/wow",
                headers={
                    'Authorization': f"Bearer {access_token}"
                },
                params={
                    'namespace': 'profile-us',
                    'locale': 'en_US'
                }
            )
            
            if retail_response.status_code != 200:
                print(f"Retail profile fetch error: {retail_response.text}") # Debug log
                retail_data = None
            else:
                retail_data = retail_response.json()
                print(f"Retail profile data received: {retail_data}") # Debug log

            # Get classic profile
            classic_response = await client.get(
                f"{BATTLE_NET_API_URL}/profile/user/wow",
                headers={
                    'Authorization': f"Bearer {access_token}"
                },
                params={
                    'namespace': 'profile-classic-us',
                    'locale': 'en_US'
                }
            )
            
            if classic_response.status_code != 200:
                print(f"Classic profile fetch error: {classic_response.text}") # Debug log
                classic_data = None
            else:
                classic_data = classic_response.json()
                print(f"Classic profile data received: {classic_data}") # Debug log

            return {
                'retail': retail_data,
                'classic': classic_data
            }
    except httpx.HTTPError as e:
        error_detail = f"HTTP error occurred: {str(e)}"
        print(f"HTTP error: {error_detail}") # Debug log
        raise HTTPException(status_code=500, detail=error_detail)
    except Exception as e:
        error_detail = f"Unexpected error: {str(e)}"
        print(f"Unexpected error: {error_detail}") # Debug log
        raise HTTPException(status_code=500, detail=error_detail)

@app.post('/api/character')
async def get_character_info(request: CharacterRequest, req: Request):
    """Get character information for both retail and classic"""
    access_token = req.headers.get('Authorization', '').replace('Bearer ', '')
    if not access_token:
        raise HTTPException(status_code=401, detail="No access token provided")

    try:
        async with httpx.AsyncClient() as client:
            namespace = NAMESPACES[request.game_version]
            
            # Format realm and character name
            realm_slug = request.realm.lower()
            character_name = request.name.lower()
            
            # Construct the base URL with proper formatting
            base_url = f"{BATTLE_NET_API_URL}/profile/wow/character/{realm_slug}/{character_name}"
            print(f"Fetching character data from: {base_url}") # Debug log
            
            # Get character profile
            profile_response = await client.get(
                base_url,
                headers={
                    'Authorization': f"Bearer {access_token}"
                },
                params={
                    'namespace': namespace,
                    'locale': 'en_US'
                }
            )
            
            if profile_response.status_code != 200:
                error_detail = f"Failed to fetch character profile: {profile_response.text}"
                print(f"Profile fetch error: {error_detail}") # Debug log
                raise HTTPException(
                    status_code=profile_response.status_code,
                    detail=error_detail
                )
            
            profile_data = profile_response.json()
            print(f"Profile data received: {profile_data}") # Debug log
            
            # Get character equipment
            equipment_response = await client.get(
                f"{base_url}/equipment",
                headers={
                    'Authorization': f"Bearer {access_token}"
                },
                params={
                    'namespace': namespace,
                    'locale': 'en_US'
                }
            )
            equipment_data = equipment_response.json() if equipment_response.status_code == 200 else None
            
            # Get character PvP stats
            pvp_response = await client.get(
                f"{base_url}/pvp-summary",
                headers={
                    'Authorization': f"Bearer {access_token}"
                },
                params={
                    'namespace': namespace,
                    'locale': 'en_US'
                }
            )
            pvp_data = pvp_response.json() if pvp_response.status_code == 200 else None
            
            # Get character media (avatar)
            media_response = await client.get(
                f"{base_url}/character-media",
                headers={
                    'Authorization': f"Bearer {access_token}"
                },
                params={
                    'namespace': namespace,
                    'locale': 'en_US'
                }
            )
            media_data = media_response.json() if media_response.status_code == 200 else None
            
            return {
                'profile': {
                    'character': {
                        **profile_data,
                        'media': media_data
                    }
                },
                'equipment': equipment_data,
                'pvp': pvp_data
            }
    except httpx.HTTPError as e:
        error_detail = f"HTTP error occurred: {str(e)}"
        print(f"HTTP error: {error_detail}") # Debug log
        raise HTTPException(status_code=500, detail=error_detail)
    except Exception as e:
        error_detail = f"Unexpected error: {str(e)}"
        print(f"Unexpected error: {error_detail}") # Debug log
        raise HTTPException(status_code=500, detail=error_detail)

@app.post('/api/character/set-main')
async def set_main_character(request: SetMainCharacterRequest, req: Request):
    """Set a character as the main character for the specified game version"""
    access_token = req.headers.get('Authorization', '').replace('Bearer ', '')
    if not access_token:
        raise HTTPException(status_code=401, detail="No access token provided")

    try:
        # Get user profile to get battletag
        async with httpx.AsyncClient() as client:
            profile_response = await client.get(
                BATTLE_NET_USERINFO_URL,
                headers={
                    'Authorization': f"Bearer {access_token}"
                }
            )
            
            if profile_response.status_code != 200:
                raise HTTPException(status_code=profile_response.status_code, detail="Failed to get user profile")
            
            profile_data = profile_response.json()
            battletag = profile_data.get('battletag')
            account_id = profile_data.get('id')
            
            if not battletag or not account_id:
                raise HTTPException(status_code=400, detail="No battletag or account ID found in profile data")

            # Update database
            db = SessionLocal()
            try:
                # Remove existing main character for this game version
                db.query(MainCharacter).filter(
                    MainCharacter.id == account_id,
                    MainCharacter.game_version == request.game_version
                ).delete()

                # Add new main character
                main_char = MainCharacter(
                    id=account_id,
                    battletag=battletag,
                    realm=request.realm.lower(),
                    name=request.name.lower(),
                    game_version=request.game_version,
                    is_main=True
                )
                db.add(main_char)
                db.commit()
                
                return {"message": "Main character set successfully"}
            finally:
                db.close()

    except httpx.HTTPError as e:
        error_detail = f"HTTP error occurred: {str(e)}"
        print(f"HTTP error: {error_detail}")
        raise HTTPException(status_code=500, detail=error_detail)
    except Exception as e:
        error_detail = f"Unexpected error: {str(e)}"
        print(f"Unexpected error: {error_detail}")
        raise HTTPException(status_code=500, detail=error_detail)

@app.get('/api/character/main')
async def get_main_character(req: Request):
    """Get the main character for the specified game version"""
    access_token = req.headers.get('Authorization', '').replace('Bearer ', '')
    if not access_token:
        raise HTTPException(status_code=401, detail="No access token provided")

    try:
        # Get user profile to get account ID
        async with httpx.AsyncClient() as client:
            profile_response = await client.get(
                BATTLE_NET_USERINFO_URL,
                headers={
                    'Authorization': f"Bearer {access_token}"
                }
            )
            
            if profile_response.status_code != 200:
                raise HTTPException(status_code=profile_response.status_code, detail="Failed to get user profile")
            
            profile_data = profile_response.json()
            account_id = profile_data.get('id')
            
            if not account_id:
                raise HTTPException(status_code=400, detail="No account ID found in profile data")

            # Get main character from database
            db = SessionLocal()
            try:
                main_char = db.query(MainCharacter).filter(
                    MainCharacter.id == account_id
                ).first()
                
                if not main_char:
                    return {"message": "No main character set"}
                
                return {
                    "realm": main_char.realm,
                    "name": main_char.name,
                    "game_version": main_char.game_version
                }
            finally:
                db.close()

    except httpx.HTTPError as e:
        error_detail = f"HTTP error occurred: {str(e)}"
        print(f"HTTP error: {error_detail}")
        raise HTTPException(status_code=500, detail=error_detail)
    except Exception as e:
        error_detail = f"Unexpected error: {str(e)}"
        print(f"Unexpected error: {error_detail}")
        raise HTTPException(status_code=500, detail=error_detail)

@app.get("/api/pvp-leaderboard/{bracket}")
async def get_pvp_leaderboard(bracket: str, game_version: GameVersion = GameVersion.RETAIL):
    """Get PvP leaderboard information for both retail and classic"""
    token = await get_battle_net_token()
    namespace = DYNAMIC_NAMESPACES[game_version]  # Use dynamic namespace for leaderboard
    season = SEASONS[game_version]
    
    # Format bracket to match Battle.net API requirements
    bracket_map = {
        '2v2': '2v2',
        '3v3': '3v3',
        '5v5': '5v5'
    }
    
    if bracket not in bracket_map:
        raise HTTPException(status_code=400, detail="Invalid bracket. Must be one of: 2v2, 3v3, 5v5")
    
    formatted_bracket = bracket_map[bracket]
    
    try:
        async with httpx.AsyncClient() as client:
            # Get the leaderboard for the current season
            leaderboard_url = f"{BATTLE_NET_API_URL}/data/wow/pvp-season/{season}/pvp-leaderboard/{formatted_bracket}"
            print(f"Fetching leaderboard from: {leaderboard_url}") # Debug log
            
            leaderboard_response = await client.get(
                leaderboard_url,
                headers={
                    "Authorization": f"Bearer {token}"
                },
                params={
                    "namespace": namespace,
                    "locale": "en_US"
                }
            )
            
            if leaderboard_response.status_code == 404:
                raise HTTPException(status_code=404, detail="PvP leaderboard not found. Please check if the bracket is valid (2v2, 3v3, or 5v5)")
            elif leaderboard_response.status_code == 401:
                raise HTTPException(status_code=401, detail="Unauthorized. Please check your Battle.net API credentials")
            elif leaderboard_response.status_code != 200:
                raise HTTPException(
                    status_code=leaderboard_response.status_code,
                    detail=f"Failed to fetch PvP leaderboard: {leaderboard_response.text}"
                )
            
            return leaderboard_response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to Battle.net API: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.post('/api/social-links')
async def update_social_links(request: SocialLinksRequest, req: Request):
    """Update social media links for a user"""
    access_token = req.headers.get('Authorization', '').replace('Bearer ', '')
    if not access_token:
        raise HTTPException(status_code=401, detail="No access token provided")

    try:
        # Get user profile to get battletag
        async with httpx.AsyncClient() as client:
            profile_response = await client.get(
                BATTLE_NET_USERINFO_URL,
                headers={
                    'Authorization': f"Bearer {access_token}"
                }
            )
            
            if profile_response.status_code != 200:
                raise HTTPException(status_code=profile_response.status_code, detail="Failed to get user profile")
            
            profile_data = profile_response.json()
            battletag = profile_data.get('battletag')
            
            if not battletag:
                raise HTTPException(status_code=400, detail="No battletag found in profile data")

            # Update database
            db = SessionLocal()
            try:
                # Check if social links exist for this battletag
                social_links = db.query(SocialLinks).filter(SocialLinks.battletag == battletag).first()
                
                if social_links:
                    # Update existing social links
                    for key, value in request.dict().items():
                        if value is not None:
                            setattr(social_links, key, value)
                else:
                    # Create new social links
                    social_links = SocialLinks(
                        battletag=battletag,
                        **request.dict()
                    )
                    db.add(social_links)
                
                db.commit()
                return {"message": "Social links updated successfully"}
            finally:
                db.close()

    except httpx.HTTPError as e:
        error_detail = f"HTTP error occurred: {str(e)}"
        print(f"HTTP error: {error_detail}")
        raise HTTPException(status_code=500, detail=error_detail)
    except Exception as e:
        error_detail = f"Unexpected error: {str(e)}"
        print(f"Unexpected error: {error_detail}")
        raise HTTPException(status_code=500, detail=error_detail)

@app.get('/api/social-links/{battletag}')
async def get_social_links(battletag: str):
    """Get social media links for a user"""
    try:
        db = SessionLocal()
        try:
            social_links = db.query(SocialLinks).filter(SocialLinks.battletag == battletag).first()
            
            if not social_links:
                return {"message": "No social links found"}
            
            return {
                "discord": social_links.discord,
                "twitch": social_links.twitch,
                "twitter": social_links.twitter,
                "youtube": social_links.youtube,
                "instagram": social_links.instagram
            }
        finally:
            db.close()

    except Exception as e:
        error_detail = f"Unexpected error: {str(e)}"
        print(f"Unexpected error: {error_detail}")
        raise HTTPException(status_code=500, detail=error_detail)

@app.get("/")
async def root():
    return {"message": "WoW Classic Armory API is running"} 