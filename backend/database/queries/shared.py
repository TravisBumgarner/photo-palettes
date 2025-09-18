from common.models import Palette, PaletteFavorite, SortBy
from sqlalchemy import func

ORDER_BY = {
    SortBy.NEWEST: Palette.created_at.desc(),
    SortBy.FAVORITES_COUNT: func.count(PaletteFavorite.palette_id).desc(),
    SortBy.OLDEST: Palette.created_at.asc(),
}
