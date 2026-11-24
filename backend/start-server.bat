@echo off
title StayFinder Backend Server
echo ==========================================
echo    Starting StayFinder Backend Server
echo ==========================================
cd /d "%~dp0"
node server.js
pause