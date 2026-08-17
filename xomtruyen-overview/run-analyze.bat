@echo off
echo.
echo ========================================
echo  XomTruyen - Chay Auto Analyzer
echo ========================================
echo.
cd /d "%~dp0\.."
node "%~dp0auto-analyze.js"
echo.
pause
