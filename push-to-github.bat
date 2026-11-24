@echo off
title Push StayFinder to GitHub
echo ===================================================
echo     Pushing StayFinder to your GitHub repository
echo ===================================================
echo.
cd /d "%~dp0"
"..\PortableGit\cmd\git.exe" push -u origin main
echo.
echo ===================================================
echo Done! If asked to log in, complete the browser login.
echo ===================================================
pause
