"""
Edge Colors Algorithm

Extracts colors from high-contrast edge regions using Sobel edge detection.
These are often the most visually important areas of an image - where objects
meet backgrounds, where light meets shadow.
"""

import numpy as np
from PIL import Image
from scipy import ndimage

from algorithms.consts import PALETTE_SIZE
from algorithms.types import TGeneratedPalette, TSwatch
from algorithms.utils import rgb_to_hex


def edge_colors(image: Image.Image) -> TGeneratedPalette:
    img_array = np.array(image)
    height, width = img_array.shape[:2]

    # Convert to grayscale for edge detection
    gray = np.mean(img_array, axis=2)

    # Apply Sobel filter for edge detection
    sobel_x = ndimage.sobel(gray, axis=1)
    sobel_y = ndimage.sobel(gray, axis=0)
    edge_magnitude = np.hypot(sobel_x, sobel_y)

    # Normalize edge magnitude
    edge_magnitude = edge_magnitude / edge_magnitude.max()

    # Find pixels with strong edges
    edge_threshold = 0.3
    strong_edge_mask = edge_magnitude > edge_threshold

    # Get coordinates of strong edge pixels
    edge_coords = np.argwhere(strong_edge_mask)

    if len(edge_coords) < PALETTE_SIZE:
        # Fallback: lower threshold
        edge_threshold = 0.1
        strong_edge_mask = edge_magnitude > edge_threshold
        edge_coords = np.argwhere(strong_edge_mask)

    if len(edge_coords) < PALETTE_SIZE:
        # If still not enough, just sample randomly
        edge_coords = np.argwhere(np.ones((height, width), dtype=bool))

    # Sample 6 diverse edge points using farthest point sampling
    pixels = img_array.reshape(-1, 3)
    flat_indices = edge_coords[:, 0] * width + edge_coords[:, 1]

    selected_indices = []
    selected_coords = []

    # Start with the strongest edge point
    edge_strengths = edge_magnitude[edge_coords[:, 0], edge_coords[:, 1]]
    first_idx = np.argmax(edge_strengths)
    selected_indices.append(flat_indices[first_idx])
    selected_coords.append(edge_coords[first_idx])

    for _ in range(PALETTE_SIZE - 1):
        if len(edge_coords) == 0:
            break

        # Calculate distance to all selected points
        min_distances = np.full(len(edge_coords), np.inf)
        for coord in selected_coords:
            distances = np.sqrt(
                (edge_coords[:, 0] - coord[0]) ** 2 + (edge_coords[:, 1] - coord[1]) ** 2
            )
            min_distances = np.minimum(min_distances, distances)

        # Select the farthest point
        farthest_idx = np.argmax(min_distances)
        selected_indices.append(flat_indices[farthest_idx])
        selected_coords.append(edge_coords[farthest_idx])

    colors = []
    locations = []

    for flat_idx, coord in zip(selected_indices, selected_coords, strict=True):
        y, x = coord
        rgb = tuple(int(c) for c in pixels[flat_idx])
        colors.append(rgb)
        locations.append((x / width * 100, y / height * 100))

    hex_colors = [rgb_to_hex(color) for color in colors]

    return [
        TSwatch(color=color.upper(), percent_location=loc)
        for color, loc in zip(hex_colors, locations, strict=True)
    ]
