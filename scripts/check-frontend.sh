#!/bin/bash


# Exit on error
set -e

echo "Checking frontend..."
echo "Linting..."
cd frontend && npm run lint