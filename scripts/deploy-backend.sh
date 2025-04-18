#!/bin/bash

# Test everything
if ! ./scripts/check-backend.sh; then
    echo "Error: check-backend.sh failed"
    exit 1
fi

BACKEND_DIR="backend"
DEPLOY_DIR="tmp-heroku-deploy"

# Deploy FastAPI backend to Heroku
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR
cp -r $BACKEND_DIR/* $DEPLOY_DIR/
cp $BACKEND_DIR/requirements.txt $DEPLOY_DIR/
cp Procfile $DEPLOY_DIR/  # Copy from root directory

cd $DEPLOY_DIR
git init
git remote add heroku https://git.heroku.com/photo-palettes-backend.git
git add .
git commit -m "Deploy backend"
git push -f heroku main
cd ..
rm -rf $DEPLOY_DIR

heroku open --app photo-palettes-backend

echo "Do you need to deploy migrations?
echo "Do you need to deploy migrations?
echo "Do you need to deploy migrations?
echo "Do you need to deploy migrations?
echo "Do you need to deploy migrations?
echo "Do you need to deploy migrations?
echo "Do you need to deploy migrations?