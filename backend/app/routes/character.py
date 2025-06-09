from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_blizzard_token():
    """Get a Blizzard API access token using client credentials."""
    client_id = os.getenv("BLIZZARD_CLIENT_ID")
    client_secret = os.getenv("BLIZZARD_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        raise HTTPException(status_code=500, detail="Blizzard API credentials not configured")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://us.battle.net/oauth/token",
            data={
                "grant_type": "client_credentials",
                "client_id": client_id,
                "client_secret": client_secret
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to get Blizzard token")
        
        return response.json()["access_token"]

@router.get("/api/character/{region}/{realm}/{name}")
async def get_character(
    region: str,
    realm: str,
    name: str,
    game_version: str = "retail",
    token: str = Depends(oauth2_scheme)
):
    """Get character data from Blizzard API."""
    try:
        # Get Blizzard API token
        blizzard_token = await get_blizzard_token()
        
        # Determine namespace based on game version
        namespace = "profile-us" if game_version == "retail" else "profile-classic-us"
        
        # Construct the Blizzard API URL
        url = f"https://{region}.api.blizzard.com/profile/wow/character/{realm}/{name}"
        
        # Make request to Blizzard API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                params={
                    "namespace": namespace,
                    "locale": "en_US"
                },
                headers={
                    "Authorization": f"Bearer {blizzard_token}",
                    "Accept": "application/json"
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to fetch character data: {response.text}"
                )
            
            return response.json()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 