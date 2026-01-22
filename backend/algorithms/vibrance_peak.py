"""
Vibrance Peak Algorithm

Finds the most saturated, vibrant colors in the image using HSV color space.
These are the colors that "pop" - the ones that catch your eye first.
Great for creating energetic, attention-grabbing palettes.
"""

import numpy as np
from PIL import Image

from algorithms.types import TGeneratedPalette, TSwatch
from algorithms.utils import rgb_to_hex


def rgb_to_hsv_vectorized(pixels: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Convert RGB pixels to HSV (vectorized). Returns h, s, v arrays."""
    rgb = pixels.astype(float) / 255.0
    r, g, b = rgb[:, 0], rgb[:, 1], rgb[:, 2]

    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    diff = max_c - min_c

    # Hue calculation
    h = np.zeros_like(r)
    mask_r = (max_c == r) & (diff != 0)
    mask_g = (max_c == g) & (diff != 0)
    mask_b = (max_c == b) & (diff != 0)

    h[mask_r] = (60 * ((g[mask_r] - b[mask_r]) / diff[mask_r]) + 360) % 360
    h[mask_g] = (60 * ((b[mask_g] - r[mask_g]) / diff[mask_g]) + 120) % 360
    h[mask_b] = (60 * ((r[mask_b] - g[mask_b]) / diff[mask_b]) + 240) % 360

    # Saturation
    s = np.where(max_c == 0, 0, diff / max_c)

    # Value
    v = max_c

    return h, s, v


def vibrance_peak(image: Image.Image) -> TGeneratedPalette:
    img_array = np.array(image)
    height, width = img_array.shape[:2]
    pixels = img_array.reshape(-1, 3)

    # Calculate HSV for all pixels (vectorized)
    h, s, v = rgb_to_hsv_vectorized(pixels)

    # Vibrance score: high saturation + moderate to high value
    value_factor = 1 - np.abs(v - 0.6) * 0.5
    vibrance = s * value_factor

    # Sort by vibrance (descending)
    sort_order = np.argsort(vibrance)[::-1]

    # Group by hue to get diverse colors (iterate in vibrance order)
    hue_bins = {}
    selected = []

    for idx in sort_order:
        vib = vibrance[idx]
        if vib < 0.2:  # Skip low vibrance - since sorted, we can break early
            break

        # Bin hue into 12 segments (30 degrees each)
        hue_bin = int(h[idx] / 30) % 12
        if hue_bin not in hue_bins:
            item = (idx, h[idx], s[idx], v[idx], vib, pixels[idx])
            hue_bins[hue_bin] = item

        if len(hue_bins) >= 6:
            break

    selected = list(hue_bins.values())

    # If we don't have 6 colors, fill from top vibrance
    if len(selected) < 6:
        selected_indices = {item[0] for item in selected}
        for idx in sort_order:
            if idx not in selected_indices:
                item = (idx, h[idx], s[idx], v[idx], vibrance[idx], pixels[idx])
                selected.append(item)
                selected_indices.add(idx)
            if len(selected) >= 6:
                break

    selected = selected[:6]

    colors = []
    locations = []

    for item in selected:
        idx, h, s, v, vibrance, pixel = item
        rgb = tuple(int(c) for c in pixel)
        colors.append(rgb)

        y = (idx // width) / height * 100
        x = (idx % width) / width * 100
        locations.append((float(x), float(y)))

    hex_colors = [rgb_to_hex(color) for color in colors]

    return [
        TSwatch(color=color.upper(), percent_location=loc)
        for color, loc in zip(hex_colors, locations)
    ]
