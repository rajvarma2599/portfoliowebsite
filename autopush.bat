@echo off
echo Adding all changes...
git add .

echo Committing changes...
git commit -m "Auto push from autopush.bat"

echo Pushing to main branch...
git push origin main

echo Done!
pause
