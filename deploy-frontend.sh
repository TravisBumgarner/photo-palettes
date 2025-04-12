#!/bin/bash

# Exit on error
set -e

APP_NAME="photo-palettes-frontend"
DEPLOY_DIR="tmp-heroku-deploy"

# Clean and recreate deploy directory
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# Copy everything from frontend/, including dotfiles and excluding node_modules/.next
rsync -av frontend/ $DEPLOY_DIR/ \
  --exclude=node_modules \
  --exclude=.next

# Sanity check: confirm key files are copied
echo "📁 Contents of deploy folder:"
find $DEPLOY_DIR -type f

# Go into deploy directory and set up temp git repo
cd $DEPLOY_DIR
git init -b main
heroku git:remote -a $APP_NAME

git add .
git commit -m "Deploy frontend"

# Force push to Heroku
git push -f heroku main

# Go back and clean up
cd ..
rm -rf $DEPLOY_DIR

# Open deployed app
heroku open --app $APP_NAME
