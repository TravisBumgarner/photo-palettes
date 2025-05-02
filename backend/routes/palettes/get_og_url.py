from . import palettes_router


@palettes_router.get("/og_url/{id}")
async def get_og_url(id: str):
    return f"http://localhost:8000/uploads/{id}_og.webp"
