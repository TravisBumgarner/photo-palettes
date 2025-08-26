from sqlalchemy import func

from database.models import Palette, PaletteFavorite, SortBy

ORDER_BY = {
    SortBy.NEWEST: Palette.created_at.desc(),
    SortBy.FAVORITES_COUNT: func.count(PaletteFavorite.palette_id).desc(),
    SortBy.OLDEST: Palette.created_at.asc(),
}
