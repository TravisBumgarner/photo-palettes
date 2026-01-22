#!/bin/bash
set -euo pipefail
trap 'echo "❌ Error on line $LINENO"' ERR

# Test frontend
if ! ./scripts/check-frontend.sh; then
    echo "Error: check-frontend.sh failed"
    exit 1
fi

APP_NAME="photo-palettes-frontend"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEPLOY_DIR="$PROJECT_ROOT/tmp-heroku-deploy"
LOCAL_DIR="$PROJECT_ROOT/frontend"

# Clean and recreate deploy directory
rm -rf "$DEPLOY_DIR"
mkdir "$DEPLOY_DIR"

# Copy everything from frontend/, including dotfiles and excluding node_modules/.next
rsync -av "$LOCAL_DIR/" "$DEPLOY_DIR/" \
  --exclude=node_modules \
  --exclude=android \
  --exclude=ios 

# Sanity check: confirm key files are copied
echo "📁 Contents of deploy folder:"
find "$DEPLOY_DIR" -type f

# Go into deploy directory and set up temp git repo
cd "$DEPLOY_DIR"
git init -b main

# Check if heroku remote already exists, if so remove it first
if git remote | grep -q heroku; then
    git remote remove heroku
fi

heroku git:remote -a "$APP_NAME"

git add .
git commit -m "Deploy frontend"

# Force push to Heroku
git push -f heroku main

# Go back to project root and clean up
cd "$PROJECT_ROOT"
rm -rf "$DEPLOY_DIR"

# Open deployed app
open "https://photopalettes.com"
