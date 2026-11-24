@echo off
title Stop StayFinder Server
echo ==============================================
echo       Stopping StayFinder Backend Server
echo ==============================================
echo.
powershell -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"
echo.
echo Server stopped successfully! Port 5000 is now free.
echo ==============================================
pause
