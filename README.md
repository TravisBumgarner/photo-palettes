Photo Palettes

Social platform for generating color palettes from photos.

# Local Setup/Dev Notes

## Root

1. `make bootstrap` - Follow all instructions output to terminal.

### Backend

**Tests**

1. Test users are stored in ProtonPass.
1. Grab their credentials and populate the .env.
1. If new users are required, create their accounts, verify email addresses, then set the moderator permission level to 2 in the database.

Run tests - docker-compose exec -T backend pytest

## Frontend

**Testing index.js (Server for frontend)**

1. `docker compose up backend db`
2. `npm run build:development`
3. `npm run start` (Server changes just require a restart)

**Mobile Development**

Use simulator since it can more easily connect to Docker backend within my computer.

**Adding new packages**

Unsure if this is the best route but I believe it works if Docker gets mad about missing NPM packages.

1. `docker compose exec frontend sh`
1. `npm i`

## Backend

**Migrations**

1. From `backend/`
1. `make migration` - Give migration a helpful name of changes `user_and_color_palettes` or `add_cube_extension`
1. Populate newly created file in `backend/alembic/versions`
1. `make development-migrate` - Apply migration to docker DB
1. (Optional) To rollback `make development-downgrade`
1. Deploy app to production `cd .. && make deploy-all`
1. Migrate production `cd backend && make production-migrate`
1. (Optional) To rollback `make production-downgrade`

# Production Deploy

## Heroku

1. Bring up services to run tests before deploying - `make up`
1. Deploy make deploy-all

Useful commands:

- Shell into app `heroku ps:exec --app photo-palettes-backend`
- Logs - `heroku logs --tail --app photo-palettes-backend`

## App Store

# Deploy to App Store

1. `npx cap sync ios`
1. `npx cap open ios`
1. XCode -> Product -> Archive
1. Check test flight for build: https://appstoreconnect.apple.com/teams/2399b798-4024-4423-8dab-254bb827c7aa/apps/6751658619/testflight/ios
1. Under Internal Testing -> Test Group can add folks via email.
