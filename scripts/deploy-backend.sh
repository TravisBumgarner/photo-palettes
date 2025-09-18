#!/bin/bash

# Test everything
# if ! ./scripts/check-backend.sh; then
#     echo "Error: check-backend.sh failed"
#     exit 1
# fi

BACKEND_DIR="backend"
COMMON_DIR="common"
DEPLOY_DIR="tmp-heroku-deploy"

# Deploy FastAPI backend to Heroku
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# Copy backend code
cp -r $BACKEND_DIR/* $DEPLOY_DIR/

# Copy common into deploy dir
cp -r $COMMON_DIR $DEPLOY_DIR/$COMMON_DIR

# Rewrite requirements.txt so common is local instead of git
sed 's|^-e git+.*subdirectory=common.*$|-e ./common|' \
    $BACKEND_DIR/requirements.txt > $DEPLOY_DIR/requirements.txt

# Copy extra files
cp $BACKEND_DIR/.python-version $DEPLOY_DIR/ || true
cp $BACKEND_DIR/.gitignore $DEPLOY_DIR/ || true
cp Procfile $DEPLOY_DIR/

cd $DEPLOY_DIR
git init
git remote add heroku https://git.heroku.com/photo-palettes-backend.git
git add .
git commit -m "Deploy backend"
git push -f heroku main
cd ..
rm -rf $DEPLOY_DIR

heroku open --app photo-palettes-backend

echo "Do you need to deploy migrations?"
echo "Do you need to deploy migrations?"
echo "Do you need to deploy migrations?"
