@echo off
echo Pushing meippel changes to GitHub...
echo.

cd /d "%~dp0"

git add -A
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git add failed
    pause
    exit /b 1
)

git commit -m "Fix spelling (meippel->meppel), add 15 real Meppel places, 6 events, update about page"
if %ERRORLEVEL% NEQ 0 (
    echo No changes to commit or commit failed
    pause
    exit /b 1
)

git push
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git push failed
    pause
    exit /b 1
)

echo.
echo Successfully pushed to GitHub!
pause
