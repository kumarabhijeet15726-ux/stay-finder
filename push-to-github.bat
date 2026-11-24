@echo off
title Push StayFinder to GitHub
echo ===================================================
echo     Pushing StayFinder to your GitHub repository
echo ===================================================
echo.
cd /d "%~dp0"
git push -u origin main
echo.
echo ===================================================
echo If asked for credentials:
echo   Username: kumarabhijeet15726-ux
echo   Password: Enter your GitHub Personal Access Token
echo ===================================================
pause
