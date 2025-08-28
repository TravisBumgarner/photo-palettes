# Adding new packages

Might have to down and up first.
`docker compose exec frontend sh`
`npm i`

# Mobile Setup

- Because everything runs in Docker, it's best to run a simulator for local development.

# Testing index.js

1. `docker compose up backend db`
2. `npm run build:development`
3. `npm run start` (Server changes just require a restart)

# Deploy to App Store

1. `npx cap open ios`