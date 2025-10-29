@echo off
echo ================================================
echo   TESTING DATABASE CONNECTION
echo ================================================
echo.

cd backend
node test-db-connection.js

echo.
echo ================================================
echo   Test Complete!
echo ================================================
pause
