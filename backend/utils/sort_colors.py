import colorsys


def hex_to_hsl(hex_color: str) -> tuple[float, float, float]:
    """Convert hex color to HSL values."""
    hex_color = hex_color.lstrip("#")
    r = int(hex_color[0:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:6], 16) / 255.0

    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return (h, s, l)


def get_color_sort_key(hex_color: str) -> tuple[float, float, float]:
    """
    Return a sort key for a hex color based on HSL values.
    Sorts by hue (color wheel position), then saturation, then lightness.
    This creates a visually intuitive rainbow-like ordering.
    """
    h, s, l = hex_to_hsl(hex_color)
    # For very low saturation (grays), sort by lightness only
    if s < 0.1:
        return (10.0, 0.0, l)  # Put grays at the end
    return (h, s, l)
