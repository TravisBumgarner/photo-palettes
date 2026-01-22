"""
Spatial Corners Algorithm

Samples colors from the four corners and center of the image, plus one
from the area of maximum color variance. Based on the "rule of thirds"
composition principle, this extracts colors from naturally important
focal points of photographs.
"""

import numpy as np
from PIL import Image

from algorithms.types import TGeneratedPalette, TSwatch
from algorithms.utils import rgb_to_hex


def spatial_corners(image: Image.Image) -> TGeneratedPalette:
    img_array = np.array(image)
    height, width = img_array.shape[:2]

    # Define sample regions (as percentage of image)
    sample_size = 0.1  # 10% of image dimension

    regions = [
        ("top_left", 0, 0),
        ("top_right", 1.0 - sample_size, 0),
        ("bottom_left", 0, 1.0 - sample_size),
        ("bottom_right", 1.0 - sample_size, 1.0 - sample_size),
        ("center", 0.5 - sample_size / 2, 0.5 - sample_size / 2),
    ]

    colors = []
    locations = []

    for name, x_pct, y_pct in regions:
        # Calculate pixel coordinates
        x_start = int(x_pct * width)
        y_start = int(y_pct * height)
        x_end = min(width, int((x_pct + sample_size) * width))
        y_end = min(height, int((y_pct + sample_size) * height))

        # Extract region
        region = img_array[y_start:y_end, x_start:x_end]

        if region.size == 0:
            continue

        # Find dominant color in region using simple averaging
        # with outlier rejection
        region_pixels = region.reshape(-1, 3)

        # Calculate mean and filter outliers
        mean_color = region_pixels.mean(axis=0)
        distances = np.linalg.norm(region_pixels - mean_color, axis=1)
        threshold = np.percentile(distances, 75)
        inliers = region_pixels[distances <= threshold]

        if len(inliers) > 0:
            avg_color = inliers.mean(axis=0)
        else:
            avg_color = mean_color

        # Find pixel closest to average
        distances = np.linalg.norm(region_pixels - avg_color, axis=1)
        closest_local_idx = np.argmin(distances)

        rgb = tuple(int(c) for c in region_pixels[closest_local_idx])
        colors.append(rgb)

        # Calculate location of this pixel in full image
        local_y = closest_local_idx // (x_end - x_start)
        local_x = closest_local_idx % (x_end - x_start)
        global_x = x_start + local_x
        global_y = y_start + local_y

        locations.append((global_x / width * 100, global_y / height * 100))

    # For the 6th color, find the region with maximum color variance
    # Divide image into a 3x3 grid and find most colorful region
    grid_h = height // 3
    grid_w = width // 3

    max_variance = -1
    max_variance_region = None
    max_variance_pos = (0, 0, 0, 0)

    for row in range(3):
        for col in range(3):
            y_start = row * grid_h
            y_end = (row + 1) * grid_h if row < 2 else height
            x_start = col * grid_w
            x_end = (col + 1) * grid_w if col < 2 else width

            region = img_array[y_start:y_end, x_start:x_end]
            region_pixels = region.reshape(-1, 3).astype(float)

            # Calculate color variance
            variance = region_pixels.var(axis=0).sum()

            if variance > max_variance:
                max_variance = variance
                max_variance_region = region
                max_variance_pos = (x_start, y_start, x_end, y_end)

    if max_variance_region is not None:
        x_start, y_start, x_end, y_end = max_variance_pos
        region_pixels = max_variance_region.reshape(-1, 3)

        # Find the most "unique" color - furthest from mean
        mean_color = region_pixels.mean(axis=0)
        distances = np.linalg.norm(region_pixels - mean_color, axis=1)

        # But not too far (avoid noise)
        threshold = np.percentile(distances, 90)
        mask = distances <= threshold
        filtered_distances = distances.copy()
        filtered_distances[~mask] = 0

        most_unique_idx = np.argmax(filtered_distances)
        rgb = tuple(int(c) for c in region_pixels[most_unique_idx])

        # Avoid duplicates
        if rgb not in colors:
            colors.append(rgb)

            local_y = most_unique_idx // (x_end - x_start)
            local_x = most_unique_idx % (x_end - x_start)
            global_x = x_start + local_x
            global_y = y_start + local_y
            locations.append((global_x / width * 100, global_y / height * 100))

    # Ensure we have 6 colors
    if len(colors) < 6:
        # Sample from image center as fallback
        center_x, center_y = width // 2, height // 2
        for offset in [(0, 0), (20, 20), (-20, -20), (20, -20), (-20, 20)]:
            if len(colors) >= 6:
                break
            x = max(0, min(width - 1, center_x + offset[0]))
            y = max(0, min(height - 1, center_y + offset[1]))
            rgb = tuple(int(c) for c in img_array[y, x])
            if rgb not in colors:
                colors.append(rgb)
                locations.append((x / width * 100, y / height * 100))

    hex_colors = [rgb_to_hex(color) for color in colors[:6]]
    locations = locations[:6]

    return [
        TSwatch(color=color.upper(), percent_location=loc)
        for color, loc in zip(hex_colors, locations, strict=True)
    ]
