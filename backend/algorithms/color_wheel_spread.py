"""
Color Wheel Spread Algorithm

Divides the color wheel into 6 equal segments (60 degrees each) and finds
the most prominent color in each segment. Creates maximally diverse palettes
that span the entire spectrum present in the image.
"""

from collections import defaultdict

import numpy as np
from PIL import Image

from algorithms.consts import PALETTE_SIZE
from algorithms.types import TGeneratedPalette, TSwatch
from algorithms.utils import rgb_to_hex


def _calculate_hue_saturation(pixels: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Calculate hue and saturation for RGB pixels (vectorized)."""
    rgb = pixels.astype(float) / 255.0
    r, g, b = rgb[:, 0], rgb[:, 1], rgb[:, 2]

    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    diff = max_c - min_c

    # Hue calculation
    hue = np.full(len(pixels), -1.0)  # -1 for achromatic
    chromatic_mask = diff != 0

    mask_r = chromatic_mask & (max_c == r)
    mask_g = chromatic_mask & (max_c == g)
    mask_b = chromatic_mask & (max_c == b)

    hue[mask_r] = (60 * ((g[mask_r] - b[mask_r]) / diff[mask_r]) + 360) % 360
    hue[mask_g] = (60 * ((b[mask_g] - r[mask_g]) / diff[mask_g]) + 120) % 360
    hue[mask_b] = (60 * ((r[mask_b] - g[mask_b]) / diff[mask_b]) + 240) % 360

    # Saturation calculation
    saturation = np.where(max_c == 0, 0, diff / max_c)

    return hue, saturation


def _find_best_color_in_segment(
    segment_pixels: list[tuple[int, tuple[int, int, int], float]],
) -> tuple[int, tuple[int, int, int]] | None:
    """Find the best color in a segment by grouping similar colors and scoring."""
    if not segment_pixels:
        return None

    color_groups = defaultdict(list)
    for idx, rgb, sat in segment_pixels:
        key = (rgb[0] // 32, rgb[1] // 32, rgb[2] // 32)
        color_groups[key].append((idx, rgb, sat))

    best_group = None
    best_score = -1

    for group in color_groups.values():
        avg_saturation = sum(item[2] for item in group) / len(group)
        frequency = len(group)
        score = frequency * avg_saturation
        if score > best_score:
            best_score = score
            best_group = group

    if best_group:
        best_item = max(best_group, key=lambda x: x[2])
        return best_item[0], best_item[1]
    return None


def _add_fallback_colors(
    colors: list[tuple[int, int, int]],
    locations: list[tuple[float, float]],
    pixels: np.ndarray,
    saturation: np.ndarray,
    segments: dict[int, list[tuple[int, tuple[int, int, int], float]]],
    width: int,
    height: int,
) -> None:
    """Fill remaining colors with achromatic or less saturated pixels."""
    # Add grays or low-saturation colors
    if len(colors) < 6:
        achromatic_indices = np.where(saturation < 0.15)[0]
        for idx in achromatic_indices:
            if len(colors) >= 6:
                break
            pixel = pixels[idx]
            rgb = (int(pixel[0]), int(pixel[1]), int(pixel[2]))
            if rgb not in colors:
                colors.append(rgb)
                y = (idx // width) / height * 100
                x = (idx % width) / width * 100
                locations.append((float(x), float(y)))

    # Still not 6? Grab from largest segments
    if len(colors) < PALETTE_SIZE:
        all_segment_pixels = []
        for seg in segments.values():
            all_segment_pixels.extend(seg)
        all_segment_pixels.sort(key=lambda x: x[2], reverse=True)

        for idx, rgb, _ in all_segment_pixels:
            if len(colors) >= 6:
                break
            if rgb not in colors:
                colors.append(rgb)
                y = (idx // width) / height * 100
                x = (idx % width) / width * 100
                locations.append((float(x), float(y)))


def color_wheel_spread(image: Image.Image) -> TGeneratedPalette:
    """Main function to generate color palette using color wheel spread algorithm."""
    img_array = np.array(image)
    height, width = img_array.shape[:2]
    pixels = img_array.reshape(-1, 3)

    hue, saturation = _calculate_hue_saturation(pixels)

    # Divide color wheel into 6 segments
    num_segments = 6
    segment_size = 360 / num_segments

    # Filter for chromatic colors with sufficient saturation
    valid_mask = (hue >= 0) & (saturation >= 0.15)
    valid_indices = np.where(valid_mask)[0]
    valid_hues = hue[valid_mask]
    valid_sats = saturation[valid_mask]

    # Assign to segments
    segment_assignments = (valid_hues / segment_size).astype(int) % num_segments

    # Group pixels by hue segment
    segments: dict[int, list[tuple[int, tuple[int, int, int], float]]] = {
        i: [] for i in range(num_segments)
    }

    for i, idx in enumerate(valid_indices):
        seg = segment_assignments[i]
        pixel = pixels[idx]
        segments[seg].append((idx, (int(pixel[0]), int(pixel[1]), int(pixel[2])), valid_sats[i]))

    colors = []
    locations = []

    # For each segment, find the best color
    for segment_idx in range(num_segments):
        result = _find_best_color_in_segment(segments[segment_idx])
        if result:
            idx, rgb = result
            colors.append(rgb)
            y = (idx // width) / height * 100
            x = (idx % width) / width * 100
            locations.append((float(x), float(y)))

    # Fill remaining colors if needed
    _add_fallback_colors(colors, locations, pixels, saturation, segments, width, height)

    hex_colors = [rgb_to_hex(color) for color in colors[:6]]
    locations = locations[:6]

    return [
        TSwatch(color=color.upper(), percent_location=loc)
        for color, loc in zip(hex_colors, locations, strict=True)
    ]
