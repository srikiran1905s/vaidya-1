@echo off
echo ================================================
echo   VAIDYA TELEMEDICINE PLATFORM
echo   Starting Backend Server...
echo ================================================
echo.

cd backend
echo Starting server on http://localhost:5000
echo.
echo Frontend will be available at: http://localhost:5000
echo API Health Check: http://localhost:5000/api/health
echo.
echo Press Ctrl+C to stop the server
echo ================================================
echo.

node server.js
