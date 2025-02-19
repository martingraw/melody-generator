#!/bin/bash

# Activate backend virtual environment
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm start &
FRONTEND_PID=$!

# Trap to ensure clean shutdown
trap 'kill $BACKEND_PID $FRONTEND_PID' SIGINT SIGTERM

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
