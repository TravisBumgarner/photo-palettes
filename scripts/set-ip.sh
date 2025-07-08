#!/bin/bash

# Get your current LAN IP
MY_IP=$(ipconfig getifaddr en0)
ENV_FILE="./frontend/.env"
KEY="NEXT_PUBLIC_API_URL"
VALUE="http://$MY_IP:8000"

# If the key exists, replace it; otherwise, append it
if grep -q "^$KEY=" "$ENV_FILE"; then
  sed -i '' "s|^$KEY=.*|$KEY=$VALUE|" "$ENV_FILE"
else
  echo "$KEY=$VALUE" >> "$ENV_FILE"
fi

echo "Updated $KEY to $VALUE in $ENV_FILE"