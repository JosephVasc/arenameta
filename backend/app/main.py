from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, leaderboard, character

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(leaderboard.router)
app.include_router(character.router)

@app.get("/")
async def root():
    return {"message": "ArenaMeta API"} 