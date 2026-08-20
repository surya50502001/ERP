@echo off
echo Starting Prime ERP Frontend Server on http://0.0.0.0:3000 ...
python -m http.server 3000 --bind 0.0.0.0
pause
