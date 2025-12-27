#!/bin/bash
echo "Stopping old server..."
lsof -t -i:5001 | xargs kill -9 2>/dev/null || echo "No server running on 5001"

echo "Pushing to GitHub..."
git add .
git commit -m "Final JARVIS Update: Reactor Animation & AI Fixes"
git push origin main

echo "Starting new server..."
cd backend
node server.js
