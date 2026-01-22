from collections import defaultdict
from typing import Literal

import numpy as np
from colormath.color_conversions import convert_color
from colormath.color_diff import delta_e_cie2000
from colormath.color_objects import LabColor, sRGBColor
from PIL import Image

from algorithms.types import TSwatch

from .consts import PALETTE_SIZE

# colormath seems to not work with newer versions of numpy. So monkey patch.
if not hasattr(np, "asscalar"):
    np.asscalar = lambda a: a.item()  # type: ignore


def perceptual_color_distance(hex1: str, hex2: str) -> float:
    rgb1 = sRGBColor.new_from_rgb_hex(hex1)
    rgb2 = sRGBColor.new_from_rgb_hex(hex2)

    lab1 = convert_color(rgb1, LabColor)
    lab2 = convert_color(rgb2, LabColor)

    delta_e = delta_e_cie2000(lab1, lab2)
    return delta_e.item() if hasattr(delta_e, "item") else delta_e


def ciede2000(image: Image.Image, mode: Literal["light", "dark"]) -> list[TSwatch]:
    img_array = np.array(image)
    height, width = img_array.shape[:2]
    pixels = img_array.reshape(-1, 3)
    target_color = "FFFFFF" if mode == "light" else "000000"
    hex_colors = [f"#{r:02x}{g:02x}{b:02x}" for r, g, b in pixels]

    color_to_indices = defaultdict(list)
    for idx, color in enumerate(hex_colors):
        color_to_indices[color].append(idx)

    # Count frequencies and get sorted colors by frequency
    unique, counts = np.unique(hex_colors, return_counts=True)
    top_colors = np.argsort(counts)[::-1]

    palettes: list[str] = []
    percent_locations: list[tuple[float, float]] = []
    min_distance = 10  # Adjust this threshold as needed

    for i in top_colors:
        color = str(unique[i])
        # Skip if too similar to any existing color
        if any(perceptual_color_distance(color, existing) < min_distance for existing in palettes):
            continue

        if perceptual_color_distance(color, target_color) > 30:
            continue

        palettes.append(color)
        # Get first occurrence index for percent location
        idx = color_to_indices[color][0]
        row = idx // width
        col = idx % width
        x_percent = (col / (width - 1)) * 100
        y_percent = (row / (height - 1)) * 100
        percent_locations.append((x_percent, y_percent))

        if len(palettes) == PALETTE_SIZE:
            break

    return [
        TSwatch(color=color.upper(), percent_location=percent_locations[i])
        for i, color in enumerate(palettes)
    ]
