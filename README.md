Photo Palettes

Social platform for generating color palettes from photos.

# Local Setup/Dev Notes

## Python Environments

There are a lot of python environments. Make sure each folder is properly mapped to its env. For Example `backend/` -> `.venv-backend`. And make sure to pip freeze from the correct env.

## Root

1. `make bootstrap` - Follow all instructions output to terminal.

### Backend

### Tests

1. Test users are stored in ProtonPass.
1. Grab their credentials and populate the .env.
1. If new users are required, create their accounts, verify email addresses, then set the moderator permission level to 2 in the database.

Run tests - docker-compose exec -T backend pytest

## Frontend

### Installing dependencies

Dependencies are fully managed by Docker. Bootstrap and package install script add an empty node_modules/ which is needed for Docker. The `frontend_node_modules` volume then shares things installed in Docker to the host. To install a new package run `npm run docker:install foobar` within frontend. Can also run without args to sync packages to package.json

### Testing index.js (Server for frontend)

1. `docker compose up backend db`
1. `npm run build:development`
1. `npm run start` (Server changes just require a restart)

### Mobile Development

#### Simulator

Notes

- Safari dev tools sucks. If IP address changes, in capacitor.config.js, need to quit safari.
- Console.logs are currently just not showing up?? Again, Safari sucks. I had to quit Safari multiple times before I could see the output from the simulator.

1. Bring up all services `make up`
1. `cd frontend`
1. Start local development
   - `npm run ios:dev-development` - for simulators ONLY, testing local frontend and local backend
   - `npm run ios:dev-production` - for simulators AND devices, testing local frontend and production backend
1. To debug, start safari, select simulator and there should be an app to select.

#### Device

1. `cd frontend`
1. Start local development `npm run ios:device`
1. Will use backend production. (Currently, I feel like I'll never need to test the local backend from a physical device, the simulator should be enough.)
1. To debug, start safari, select simulator and there should be an app to select.

Debug Notes

- If stuck on splash screen could be because `make up` hasn't been run.

### Adding new packages

Unsure if this is the best route but I believe it works if Docker gets mad about missing NPM packages.

1. `docker compose exec frontend sh`
1. `npm i`

## Database

### Migrations

1. From `database/`
1. `make migration` - Give migration a helpful name of changes `user_and_color_palettes` or `add_cube_extension`
1. Populate newly created file in `database/alembic/versions`
1. `make development-migrate` - Apply migration to docker DB
1. (Optional) To rollback `make development-downgrade`
1. Deploy app to production `cd .. && make deploy-all`
1. Migrate production `cd database && make production-migrate`
1. (Optional) To rollback `make production-downgrade`

# Production Deploy

## Heroku

1. Bring up services to run tests before deploying - `make up`
1. Deploy make deploy-all
1. Check for any new migrations.

Useful commands:

- Shell into app `heroku ps:exec --app photo-palettes-backend`
- Logs - `heroku logs --tail --app photo-palettes-backend`

## App Store

# Deploy to App Store

1. `cd frontend && npm run ios:production-build`
1. `npx cap open ios`
1. XCode -> Product -> Archive
1. User Testing
   1. Check test flight for build: https://appstoreconnect.apple.com/teams/2399b798-4024-4423-8dab-254bb827c7aa/apps/6751658619/testflight/ios
   1. Under Internal Testing -> Test Group can add folks via email.
1. Production Release
