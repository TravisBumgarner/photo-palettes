import csv


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert a hex color string to RGB values."""
    hex_color = hex_color.lstrip("#")
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    return (r, g, b)


def load_colors(csv_path: str) -> list[tuple[str, tuple[int, int, int]]]:
    print(f"Loading colors from {csv_path}")  # noqa T201
    colors = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            colors.append((row["name"], hex_to_rgb(row["hex"])))
    return colors


colors = load_colors("utils/colors.csv")


def closest_color_name(target: tuple[int, int, int]) -> str:
    """Return the closest color name from the palette."""
    return min(colors, key=lambda c: sum((a - b) ** 2 for a, b in zip(target, c[1], strict=False)))[
        0
    ]
