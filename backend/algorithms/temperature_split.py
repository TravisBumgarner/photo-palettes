"""
Temperature Split Algorithm

Separates colors into warm (reds, oranges, yellows) and cool (blues, greens, purples)
categories, then picks the most prominent of each. Creates naturally balanced
palettes with visual temperature contrast.
"""

import numpy as np
from PIL import Image

from algorithms.types import TGeneratedPalette, TSwatch
from algorithms.utils import rgb_to_hex


def temperature_split(image: Image.Image) -> TGeneratedPalette:
    img_array = np.array(image)
    height, width = img_array.shape[:2]
    pixels = img_array.reshape(-1, 3)

    # Calculate temperature for each pixel (vectorized)
    # Positive = warm, negative = cool (based on opponent color theory)
    r, g, b = pixels[:, 0].astype(float), pixels[:, 1].astype(float), pixels[:, 2].astype(float)
    temperatures = (r - b) / 255.0 + (r - g) / 255.0 * 0.5

    # Split into warm and cool
    warm_mask = temperatures > 0.1
    cool_mask = temperatures < -0.1

    warm_pixels = pixels[warm_mask]
    cool_pixels = pixels[cool_mask]
    warm_indices = np.where(warm_mask)[0]
    cool_indices = np.where(cool_mask)[0]

    def get_diverse_colors(pixel_subset, indices, count):
        """Select diverse colors from a pixel subset using color distance."""
        if len(pixel_subset) == 0:
            return [], []

        # Group similar colors
        from collections import defaultdict

        color_groups = defaultdict(list)
        for i, pixel in enumerate(pixel_subset):
            # Quantize to reduce similar colors
            key = (pixel[0] // 32, pixel[1] // 32, pixel[2] // 32)
            color_groups[key].append((i, pixel))

        # Sort groups by size and pick representatives
        sorted_groups = sorted(color_groups.values(), key=len, reverse=True)

        selected_colors = []
        selected_indices = []

        for group in sorted_groups[:count]:
            if len(selected_colors) >= count:
                break
            # Pick the pixel closest to group average
            group_pixels = np.array([g[1] for g in group])
            avg = group_pixels.mean(axis=0)
            distances = np.linalg.norm(group_pixels - avg, axis=1)
            best_idx = np.argmin(distances)
            local_idx = group[best_idx][0]

            selected_colors.append(tuple(int(c) for c in pixel_subset[local_idx]))
            selected_indices.append(indices[local_idx])

        return selected_colors, selected_indices

    # Get 3 warm and 3 cool colors
    warm_colors, warm_idx = get_diverse_colors(warm_pixels, warm_indices, 3)
    cool_colors, cool_idx = get_diverse_colors(cool_pixels, cool_indices, 3)

    # Combine and ensure we have 6 colors
    all_colors = warm_colors + cool_colors
    all_indices = list(warm_idx) + list(cool_idx)

    # If we don't have enough, fill with neutrals
    if len(all_colors) < 6:
        neutral_mask = ~warm_mask & ~cool_mask
        neutral_pixels = pixels[neutral_mask]
        neutral_indices = np.where(neutral_mask)[0]
        extra_colors, extra_indices = get_diverse_colors(
            neutral_pixels, neutral_indices, 6 - len(all_colors)
        )
        all_colors.extend(extra_colors)
        all_indices.extend(extra_indices)

    # Truncate if we somehow have more than 6
    all_colors = all_colors[:6]
    all_indices = all_indices[:6]

    hex_colors = [rgb_to_hex(color) for color in all_colors]
    locations = []

    for idx in all_indices:
        y = (idx // width) / height * 100
        x = (idx % width) / width * 100
        locations.append((float(x), float(y)))

    return [
        TSwatch(color=color.upper(), percent_location=loc)
        for color, loc in zip(hex_colors, locations)
    ]
