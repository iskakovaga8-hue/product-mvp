@echo off
cd /d "%~dp0"

if not exist ".git" (
    echo [1/4] Initializing git...
    git init
    git config user.email "you@example.com"
    git config user.name "Your Name"
)

echo.
echo ========================================
echo Files to be added:
echo ========================================
git add .
git status

echo.
echo Press Ctrl+C to cancel or Enter to continue...
pause >nul

echo.
echo [2/4] Creating commit...
git commit -m "Initial commit"

echo.
echo ========================================
echo MANUAL STEP REQUIRED:
echo 1. Go to https://github.com/new
echo 2. Create NEW repository (name: product-mvp)
echo 3. Do NOT check any boxes - repository must be EMPTY
echo 4. Click Create repository
echo 5. Copy the URL (like: https://github.com/YOUR_NAME/product-mvp.git)
echo ========================================
echo.
set /p REPO_URL="Paste repository URL: "

echo.
echo [3/4] Setting remote...
git branch -M main
git remote add origin %REPO_URL%

echo.
echo [4/4] Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo DONE! Repository uploaded to GitHub.
echo ========================================
pause
