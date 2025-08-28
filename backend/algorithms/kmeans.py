from typing import TypedDict

import numpy as np
from PIL import Image
from sklearn.cluster import KMeans

from .utils import rgb_to_hex


class TSwatch(TypedDict):
    color: str
    percent_location: list[float]


TGeneratedPalette = list[TSwatch]


def get_image_colors(image: Image.Image) -> TGeneratedPalette:
    img_array = np.array(image)
    pixels = img_array.reshape(-1, 3)
    kmeans = KMeans(n_clusters=6, random_state=42)
    kmeans.fit(pixels)
    colors = []
    for center in kmeans.cluster_centers_:
        rgb = tuple(int(x) for x in center)
        colors.append(rgb)

    hex_colors = [rgb_to_hex(color) for color in colors]

    # Find evenly distributed pixels for each centroid
    height, width = img_array.shape[:2]
    locations = []
    selected_indices = []

    for center in kmeans.cluster_centers_:
        # Calculate color distance to each pixel
        color_distances = np.linalg.norm(pixels - center, axis=1)

        # If we already have selected points, add a spatial distance penalty
        if selected_indices:
            # Convert flat indices to x,y coordinates for selected points
            selected_y = np.array([idx // width for idx in selected_indices])
            selected_x = np.array([idx % width for idx in selected_indices])

            # Calculate spatial distances to all pixels
            y_coords = np.arange(height).repeat(width)
            x_coords = np.tile(np.arange(width), height)

            # Calculate distance to each selected point
            spatial_distances = np.zeros(len(pixels))
            for i in range(len(selected_indices)):
                dist = np.sqrt((y_coords - selected_y[i]) ** 2 + (x_coords - selected_x[i]) ** 2)
                spatial_distances = np.maximum(spatial_distances, dist)

            # Normalize spatial distances
            max_spatial_dist = np.sqrt(height**2 + width**2)
            spatial_distances = spatial_distances / max_spatial_dist

            # Combine color and spatial distances (weighted)
            combined_distances = 0.7 * color_distances + 0.3 * (1 - spatial_distances)
        else:
            combined_distances = color_distances

        # Find the pixel with minimum combined distance
        closest_idx = np.argmin(combined_distances)
        selected_indices.append(closest_idx)

        # Convert flat index to x,y coordinates
        y = (closest_idx // width) / height * 100
        x = (closest_idx % width) / width * 100
        locations.append([float(x), float(y)])

    return [
        {"color": color.upper(), "percent_location": loc}
        for color, loc in zip(hex_colors, locations, strict=True)
    ]
