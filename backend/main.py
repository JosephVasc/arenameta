from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import requests
from typing import Optional

load_dotenv()

app = FastAPI(title="WoW Classic Armory API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Battle.net API configuration
BATTLE_NET_CLIENT_ID = os.getenv("BATTLE_NET_CLIENT_ID")
BATTLE_NET_CLIENT_SECRET = os.getenv("BATTLE_NET_CLIENT_SECRET")
BATTLE_NET_REGION = "us"  # or "eu" depending on your needs

async def get_battle_net_token():
    """Get Battle.net OAuth token"""
    token_url = f"https://{BATTLE_NET_REGION}.battle.net/oauth/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": BATTLE_NET_CLIENT_ID,
        "client_secret": BATTLE_NET_CLIENT_SECRET
    }
    response = requests.post(token_url, data=data)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to get Battle.net token")
    return response.json()["access_token"]

@app.get("/api/character/{realm}/{name}")
async def get_character(realm: str, name: str):
    """Get character information from Battle.net API"""
    token = await get_battle_net_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    # URL for WoW Classic Era API
    url = f"https://{BATTLE_NET_REGION}.api.blizzard.com/data/wow/character/{realm}/{name}"
    params = {
        "namespace": "profile-classic1x-us",
        "locale": "en_US"
    }
    
    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Character not found")
    
    return response.json()

@app.get("/api/pvp-leaderboard/{bracket}")
async def get_pvp_leaderboard(bracket: str):
    """Get PvP leaderboard information"""
    token = await get_battle_net_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Battlenet-Namespace": "dynamic-classic-us"  # Using header for namespace
    }
    
    # URL for PvP leaderboard API
    url = f"https://{BATTLE_NET_REGION}.api.blizzard.com/data/wow/pvp-region/us/pvp-season/11/pvp-leaderboard/{bracket}"
    params = {
        "locale": "en_US"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()
    except requests.exceptions.HTTPError as e:
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="PvP leaderboard not found. Please check if the bracket is valid (2v2, 3v3, or 5v5)")
        elif response.status_code == 401:
            raise HTTPException(status_code=401, detail="Unauthorized. Please check your Battle.net API credentials")
        else:
            raise HTTPException(status_code=response.status_code, detail=f"Failed to fetch PvP leaderboard: {str(e)}")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to Battle.net API: {str(e)}")

@app.get("/")
async def root():
    return {"message": "WoW Classic Armory API is running"} 