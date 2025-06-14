# WoW Classic Armory

A modern web application for viewing World of Warcraft Classic character information, similar to ironforge.pro.

## Features

- Character search by realm and name
- Detailed character information display
- Modern UI with Material-UI components
- FastAPI backend with Battle.net API integration

## Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Battle.net API credentials (Client ID and Client Secret)

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Unix/MacOS:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with your Battle.net API credentials:
   ```
   BATTLE_NET_CLIENT_ID=your_client_id_here
   BATTLE_NET_CLIENT_SECRET=your_client_secret_here
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter a realm name and character name
3. Click the search button to view character information

## API Endpoints

- `GET /api/character/{realm}/{name}` - Get character information
- `GET /` - API health check

## Technologies Used

- Frontend:
  - Next.js
  - TypeScript
  - Material-UI
  - React

- Backend:
  - FastAPI
  - Python
  - Battle.net API

## License

MIT
