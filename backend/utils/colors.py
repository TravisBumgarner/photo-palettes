from algorithms.types import TGeneratedPalette


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert a hex color string to RGB values."""
    hex_color = hex_color.lstrip("#")
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    return (r, g, b)


def luminance(rgb: tuple[int, int, int]) -> float:
    # Standard relative luminance formula for sRGB
    r, g, b = rgb
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def sort_by_luminance(palette: TGeneratedPalette) -> TGeneratedPalette:
    """Sorts a palette (list of color objects) by luminance, ascending."""
    return sorted(
        palette, key=lambda item: luminance(hex_to_rgb(item.color)), reverse=True
    )
