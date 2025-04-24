from typing import Any, Dict, List

from backend.database.engine import SessionLocal
from backend.database.models import Palette


def get_palette_colors(palette_id: str) -> List[Dict[str, Any]]:
    """
    Get the colors for a specific palette.

    Args:
        palette_id: The ID of the palette

    Returns:
        List of color dictionaries with hex values and locations
    """
    session = SessionLocal()
    try:
        palette = session.query(Palette).filter(Palette.id == palette_id).first()
        if not palette:
            return []

        # For now, return a placeholder. This should be replaced with actual color data
        # from your database or file system
        return [
            {"color": "#000000", "percent_location": [0, 0]},
            {"color": "#FFFFFF", "percent_location": [100, 100]},
        ]
    finally:
        session.close()
