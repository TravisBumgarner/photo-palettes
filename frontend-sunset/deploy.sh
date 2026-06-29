#!/bin/bash
set -e

# Static site — no build step. Uploads the page + assets straight to NFS.
# REMOTE_HOST comes from ~/.ssh/config.
REMOTE_HOST="nfs_photo-palettes"
REMOTE_DIR="/home/public"

rsync -avz --delete \
  --exclude '.git' \
  --exclude 'deploy.sh' \
  --exclude 'README.md' \
  ./ "$REMOTE_HOST:$REMOTE_DIR"

echo "Uploaded successfully to $REMOTE_HOST:$REMOTE_DIR"
