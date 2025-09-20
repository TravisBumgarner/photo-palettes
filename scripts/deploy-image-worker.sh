#!/bin/bash

# Test everything
# if ! ./scripts/check-image-worker.sh; then
#     echo "Error: check-image-worker.sh failed"
#     exit 1
# fi

IMAGE_WORKER_DIR="image-worker"
COMMON_DIR="common"
DEPLOY_DIR="tmp-heroku-deploy"

# Deploy FastAPI image-worker to Heroku
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# Copy image-worker code
cp -r $IMAGE_WORKER_DIR/* $DEPLOY_DIR/

# Copy common into deploy dir
mkdir -p $DEPLOY_DIR/common
cp -r $COMMON_DIR/common/* $DEPLOY_DIR/common/

# Rewrite requirements.txt so common is local instead of git
sed 's|^-e git+.*subdirectory=common.*$|-e ./common|' \
    $IMAGE_WORKER_DIR/requirements.txt > $DEPLOY_DIR/requirements.txt

# Copy extra files
cp $IMAGE_WORKER_DIR/.python-version $DEPLOY_DIR/ || true
cp $IMAGE_WORKER_DIR/.gitignore $DEPLOY_DIR/ || true
cp Procfile $DEPLOY_DIR/

cd $DEPLOY_DIR
git init
git remote add heroku https://git.heroku.com/photo-palettes-image-worker.git
git add .
git commit -m "Deploy image worker"
git push -f heroku main
cd ..
rm -rf $DEPLOY_DIR
