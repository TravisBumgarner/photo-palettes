#!/bin/bash

# Deploy Next.js frontend to Heroku
mkdir tmp-heroku-deploy
cp -r frontend/* tmp-heroku-deploy/
cp frontend/package.json tmp-heroku-deploy/
cp frontend/package-lock.json tmp-heroku-deploy/
cp frontend/Procfile tmp-heroku-deploy/  # Create this if needed
rm -rf tmp-heroku-deploy/node_modules/

cd tmp-heroku-deploy
git init
git remote add heroku https://git.heroku.com/photo-palettes-frontend.git
git add .
git commit -m "Deploy frontend"
git push -f heroku main
cd ..

heroku open photo-palettes-frontend