@echo off
REM Change to your project directory
cd /d D:\Documents\Debrahs Digital Solutions\dds-calculator

REM Start the preview server (serves dist). Use dev if you prefer.
npm run preview

REM If you want Chrome to auto-open after the server is ready, use this instead:
:: start "" /b cmd /c "npm run preview"
:: timeout /t 3 /nobreak >nul
:: start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --new-window --app="http://localhost:4173"
