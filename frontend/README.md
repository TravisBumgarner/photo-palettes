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

1. `npx cap sync ios`
1. `npx cap open ios`
1. XCode -> Product -> Archive
1. Check test flight for build: https://appstoreconnect.apple.com/teams/2399b798-4024-4423-8dab-254bb827c7aa/apps/6751658619/testflight/ios
1. Under Internal Testing -> Test Group can add folks via email. 

# Plan of attack for Capacitor


