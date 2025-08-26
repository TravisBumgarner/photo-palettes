# Database

## Make a Migration

1. From `backend/`
1. `make migration` - Give migration a helpful name of changes `user_and_color_palettes` or `add_cube_extension`
1. Populate newly created file in `backend/alembic/versions`
1. `make development-migrate` - Apply migration to docker DB
1. (Optional) To rollback `make development-downgrade`
1. Deploy app to production
1. `make development-production`
1. (Optional) To rollback `make production-downgrade`
