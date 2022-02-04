@echo off
cd ../backend

rem Define a default value for recording path.
set "recording_path=recording"

set /P "recording_path=Enter the name of the recording to play! (%recording_path%): "

powershell -Command "& {npm start -- --data \"../recordings/%recording_path%\"}"
pause