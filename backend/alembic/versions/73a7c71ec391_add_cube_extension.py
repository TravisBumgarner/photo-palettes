"""add cube extension

Revision ID: 73a7c71ec391
Revises: 77530de25676
Create Date: 2025-04-20 18:45:56.440773

"""

from collections.abc import Sequence

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "73a7c71ec391"
down_revision: str | None = "77530de25676"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS cube;")


def downgrade():
    op.execute("DROP EXTENSION IF EXISTS cube;")
