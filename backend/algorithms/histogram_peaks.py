"""
Histogram Peaks Algorithm

Analyzes the color histogram in LAB color space to find natural clusters.
This method finds the "true" dominant colors as perceived by humans,
accounting for the non-linear way we perceive color differences.
"""

import numpy as np
from PIL import Image

from algorithms.types import TGeneratedPalette, TSwatch
from algorithms.utils import rgb_to_hex


def rgb_to_lab_vectorized(pixels: np.ndarray) -> np.ndarray:
    """Convert RGB pixels to LAB color space (vectorized)."""
    # Normalize to 0-1
    rgb = pixels.astype(float) / 255.0

    # Apply gamma correction
    mask = rgb > 0.04045
    rgb = np.where(mask, ((rgb + 0.055) / 1.055) ** 2.4, rgb / 12.92)

    r, g, b = rgb[:, 0], rgb[:, 1], rgb[:, 2]

    # Convert to XYZ
    x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047
    y = (r * 0.2126729 + g * 0.7151522 + b * 0.0721750)
    z = (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) / 1.08883

    # Convert to LAB
    def f(t):
        return np.where(t > 0.008856, t ** (1 / 3), (7.787 * t) + (16 / 116))

    L = (116 * f(y)) - 16
    a = 500 * (f(x) - f(y))
    b_lab = 200 * (f(y) - f(z))

    return np.column_stack([L, a, b_lab])


def histogram_peaks(image: Image.Image) -> TGeneratedPalette:
    img_array = np.array(image)
    height, width = img_array.shape[:2]
    pixels = img_array.reshape(-1, 3)

    # Convert all pixels to LAB (vectorized)
    lab_pixels = rgb_to_lab_vectorized(pixels)

    # Create 3D histogram bins in LAB space
    # L: 0-100, a: -128 to 127, b: -128 to 127
    bin_size = 20

    # Compute bin indices for all pixels at once (vectorized)
    l_bins = (lab_pixels[:, 0] / bin_size).astype(int)
    a_bins = ((lab_pixels[:, 1] + 128) / bin_size).astype(int)
    b_bins = ((lab_pixels[:, 2] + 128) / bin_size).astype(int)

    # Create unique keys and group indices
    from collections import defaultdict
    histogram = defaultdict(list)
    keys = np.column_stack([l_bins, a_bins, b_bins])
    for i, key in enumerate(keys):
        histogram[tuple(key)].append(i)

    # Sort bins by count (most common colors)
    sorted_bins = sorted(histogram.items(), key=lambda x: len(x[1]), reverse=True)

    # Select 6 diverse bins using color distance in LAB space
    selected_bins = []
    selected_centroids = []

    for bin_key, indices in sorted_bins:
        if len(selected_bins) >= 6:
            break

        # Calculate centroid of this bin
        bin_lab = lab_pixels[indices].mean(axis=0)

        # Check if far enough from already selected
        min_distance = float("inf")
        for centroid in selected_centroids:
            dist = np.sqrt(np.sum((bin_lab - centroid) ** 2))
            min_distance = min(min_distance, dist)

        # Require minimum distance in LAB space (roughly 15 delta-E)
        if len(selected_centroids) == 0 or min_distance > 15:
            selected_bins.append((bin_key, indices))
            selected_centroids.append(bin_lab)

    # If we don't have 6, relax the distance constraint
    if len(selected_bins) < 6:
        for bin_key, indices in sorted_bins:
            if len(selected_bins) >= 6:
                break
            if (bin_key, indices) not in selected_bins:
                selected_bins.append((bin_key, indices))

    colors = []
    locations = []

    for bin_key, indices in selected_bins[:6]:
        # Find the pixel closest to the bin centroid
        bin_pixels = pixels[indices]
        bin_lab = lab_pixels[indices]
        centroid = bin_lab.mean(axis=0)
        distances = np.sqrt(np.sum((bin_lab - centroid) ** 2, axis=1))
        best_local_idx = np.argmin(distances)
        best_global_idx = indices[best_local_idx]

        rgb = tuple(int(c) for c in bin_pixels[best_local_idx])
        colors.append(rgb)

        y = (best_global_idx // width) / height * 100
        x = (best_global_idx % width) / width * 100
        locations.append((float(x), float(y)))

    hex_colors = [rgb_to_hex(color) for color in colors]

    return [
        TSwatch(color=color.upper(), percent_location=loc)
        for color, loc in zip(hex_colors, locations)
    ]
