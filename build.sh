#!/bin/bash
# Build script for Render deployment

echo "Installing backend dependencies..."
cd backend
npm install
cd ..
echo "Build complete!"
