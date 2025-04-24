#!/bin/bash


# Exit on error
set -e

echo "Checking frontend..."
cd frontend

echo "Linting..."
npm run lint

echo "Type checking..."
npm run typecheck


