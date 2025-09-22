# seed.py
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set.")

engine = create_engine(DATABASE_URL)

with engine.begin() as conn:
    conn.execute(
        text("""    INSERT INTO "public"."app_users"("id","auth_id","email","display_name","created_at","permission_level")
VALUES
(E'34a9fc5d-a724-4759-a516-a415f79a23e9',E'9fbf4c16-98f1-4739-9a99-cc42abd445ae',E'hello+test-moderator@travisbumgarner.dev',E'#34a9fc',E'2025-09-19 01:54:31.736536',2),
(E'7c9f2ae0-2178-4060-8ca9-ae070c9dc862',E'c1f7fc2c-5c48-45c2-b4c0-bfde3fd31463',E'hello+test-user@travisbumgarner.dev',E'#7c9f2a',E'2025-09-19 01:54:29.52024',0),
(E'd16a2d9c-caf6-4759-8c0e-5634dd12ca00',E'7f7ac45c-9093-4c7d-aeb8-98f12b313858',E'travis.bumgarner@gmail.com',E'#d16a2d',E'2025-09-19 01:52:18.347561',5);""")
    )
