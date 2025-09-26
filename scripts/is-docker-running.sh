#!/bin/bash
set -e

APP_NAME="photo-palettes-backend"  # prefix

if ! docker ps --format '{{.Names}}' | grep -q "^${APP_NAME}"; then
  echo "❌ ${APP_NAME} is not running"
  exit 1
fi

echo "✅ ${APP_NAME} is running"