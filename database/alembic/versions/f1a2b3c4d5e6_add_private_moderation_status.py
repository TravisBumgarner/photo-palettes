"""add_private_moderation_status

Revision ID: f1a2b3c4d5e6
Revises: 55369f1fb9fe
Create Date: 2026-03-14

"""

from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = "f1a2b3c4d5e6"
down_revision: Union[str, None] = "55369f1fb9fe"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ModerationStatus is stored as an Integer column, so no DDL change needed.
    # This migration documents the addition of PRIVATE = 3 to the ModerationStatus enum.
    pass


def downgrade() -> None:
    # No DDL to reverse. Any palettes with moderation_status=3 would need
    # to be updated manually before downgrading.
    pass
