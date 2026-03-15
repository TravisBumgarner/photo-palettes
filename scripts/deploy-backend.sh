#!/bin/bash

# Test everything
if ! ./scripts/check-backend.sh; then
    echo "Error: check-backend.sh failed"
    exit 1
fi

BACKEND_DIR="backend"
COMMON_DIR="common"
DEPLOY_DIR="tmp-heroku-deploy"

# Deploy FastAPI backend to Heroku
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# Copy backend code
cp -r $BACKEND_DIR/* $DEPLOY_DIR/

# Copy common into deploy dir
mkdir -p $DEPLOY_DIR/common
cp -r $COMMON_DIR/common/* $DEPLOY_DIR/common/

# Rewrite requirements.txt so common is local instead of git
sed 's|^-e git+.*subdirectory=common.*$|-e ./common|' \
    $BACKEND_DIR/requirements.txt > $DEPLOY_DIR/requirements.txt

# Copy database/alembic for migrations
mkdir -p $DEPLOY_DIR/database
cp -r database/alembic $DEPLOY_DIR/database/
cp database/alembic.ini $DEPLOY_DIR/database/

# Copy extra files
cp $BACKEND_DIR/.python-version $DEPLOY_DIR/ || true
cp $BACKEND_DIR/.gitignore $DEPLOY_DIR/ || true

cd $DEPLOY_DIR
git init
git remote add heroku https://git.heroku.com/photo-palettes-backend.git
git add .
git commit -m "Deploy backend"
git push -f heroku main
cd ..
rm -rf $DEPLOY_DIR

heroku open --app photo-palettes-backend
