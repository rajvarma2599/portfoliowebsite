@echo off
echo Checking for changes...
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Not a git repository or git not found.
    pause
    exit /b 1
)

for /f %%i in ('git status --porcelain') do set HAS_CHANGES=1
if not defined HAS_CHANGES (
    echo No changes to commit.
    pause
    exit /b 0
)

echo Adding all changes...
git add .

echo Committing changes...
git commit -m "Auto push from autopush.bat"
if %errorlevel% neq 0 (
    echo Commit failed. Please check for issues.
    pause
    exit /b 1
)

echo Pushing to main branch...
git push origin main
if %errorlevel% neq 0 (
    echo Push failed. Please check your repository settings.
    pause
    exit /b 1
)

echo Done!
pause
