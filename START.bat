@echo off
echo ================================================
echo   VAIDYA TELEMEDICINE PLATFORM
echo   Starting Flask Backend Server...
echo ================================================
echo.
echo Creating virtual environment (if missing) and installing deps...
if not exist .venv (
  py -3 -m venv .venv
)
call .\.venv\Scripts\activate.bat
pip show flask >nul 2>&1 || pip install -r backend_flask/requirements.txt

echo Starting Flask server on http://localhost:5000
echo.
echo Frontend will be available at: http://localhost:5000
echo API Health Check: http://localhost:5000/api/health
echo.
echo Press Ctrl+C to stop the server
echo ================================================
echo.
python backend_flask/app.py
