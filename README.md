# 🎵 MelodyMind: AI-Powered Melody Generator

## Overview
MelodyMind is an advanced, AI-driven melody generation platform designed for musicians, composers, and music enthusiasts.

## Features
- 🎹 Melody Generation
- 🎼 Style & Key Customization
- 🤖 AI-Powered Suggestions
- 🔄 Collaborative Workspace

## Tech Stack
- Frontend: React.js
- Backend: FastAPI
- Deployment: Netlify
- AI/ML: TensorFlow

## Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Backend Setup
1. Navigate to the backend directory
2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Quick Start
Use the provided `start_local_dev.sh` script to run both frontend and backend:
```bash
./start_local_dev.sh
```

## Deployment
- Frontend will be deployed on Netlify
- Backend serverless functions via Netlify Functions

## Contributing
We welcome contributions! Please read our contribution guidelines.

## License
MIT License
