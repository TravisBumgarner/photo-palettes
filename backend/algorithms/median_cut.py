"""
Median Cut Algorithm

The classic color quantization algorithm used in early computer graphics.
Recursively splits the color space along the axis with the greatest range,
producing palettes that efficiently represent the image's color distribution.
"""

import numpy as np
from PIL import Image

from algorithms.types import TGeneratedPalette, TSwatch
from algorithms.utils import rgb_to_hex


def median_cut(image: Image.Image) -> TGeneratedPalette:
    img_array = np.array(image)
    height, width = img_array.shape[:2]
    pixels = img_array.reshape(-1, 3)
    indices = np.arange(len(pixels))

    def split_bucket(bucket_pixels: np.ndarray, bucket_indices: np.ndarray, depth: int):
        """Recursively split color buckets along the axis with greatest range."""
        if depth == 0 or len(bucket_pixels) == 0:
            return [(bucket_pixels, bucket_indices)]

        # Find the channel with the greatest range
        ranges = bucket_pixels.max(axis=0) - bucket_pixels.min(axis=0)
        split_channel = np.argmax(ranges)

        # Sort by that channel
        sort_order = np.argsort(bucket_pixels[:, split_channel])
        sorted_pixels = bucket_pixels[sort_order]
        sorted_indices = bucket_indices[sort_order]

        # Split at median
        median_idx = len(sorted_pixels) // 2

        left_pixels = sorted_pixels[:median_idx]
        left_indices = sorted_indices[:median_idx]
        right_pixels = sorted_pixels[median_idx:]
        right_indices = sorted_indices[median_idx:]

        # Recursively split
        return split_bucket(left_pixels, left_indices, depth - 1) + split_bucket(
            right_pixels, right_indices, depth - 1
        )

    # Split into 8 buckets (2^3), then pick 6 most populous
    buckets = split_bucket(pixels, indices, depth=3)

    # Sort buckets by size
    buckets.sort(key=lambda b: len(b[0]), reverse=True)

    colors = []
    locations = []

    for bucket_pixels, bucket_indices in buckets[:6]:
        if len(bucket_pixels) == 0:
            continue

        # Calculate centroid
        centroid = bucket_pixels.mean(axis=0)

        # Find pixel closest to centroid
        distances = np.linalg.norm(bucket_pixels - centroid, axis=1)
        closest_local_idx = np.argmin(distances)
        closest_global_idx = bucket_indices[closest_local_idx]

        rgb = tuple(int(c) for c in bucket_pixels[closest_local_idx])
        colors.append(rgb)

        y = (closest_global_idx // width) / height * 100
        x = (closest_global_idx % width) / width * 100
        locations.append((float(x), float(y)))

    # Ensure we have 6 colors
    while len(colors) < 6 and len(buckets) > len(colors):
        for bucket_pixels, bucket_indices in buckets[len(colors) :]:
            if len(bucket_pixels) == 0:
                continue
            centroid = bucket_pixels.mean(axis=0)
            distances = np.linalg.norm(bucket_pixels - centroid, axis=1)
            closest_local_idx = np.argmin(distances)
            closest_global_idx = bucket_indices[closest_local_idx]
            rgb = tuple(int(c) for c in bucket_pixels[closest_local_idx])
            colors.append(rgb)
            y = (closest_global_idx // width) / height * 100
            x = (closest_global_idx % width) / width * 100
            locations.append((float(x), float(y)))
            if len(colors) >= 6:
                break

    hex_colors = [rgb_to_hex(color) for color in colors[:6]]
    locations = locations[:6]

    return [
        TSwatch(color=color.upper(), percent_location=loc)
        for color, loc in zip(hex_colors, locations, strict=True)
    ]
