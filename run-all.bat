@echo off
:: Start Back-End in a new window
start "Back End Server" cmd /k "cd backend && npm start"

:: Start Front-End in a new window
start "Front End Client" cmd /k "cd frontend && npm run dev"