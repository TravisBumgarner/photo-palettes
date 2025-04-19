import json

import numpy as np
from fastapi import UploadFile
from PIL import Image
from sklearn.cluster import KMeans

from .utils import convert_to_rgb, open_image, rgb_to_hex, scale_image


def get_image_colors(photo: UploadFile) -> list:
    image = open_image(photo)
    image = scale_image(image, 200)
    image = convert_to_rgb(image)

    img_array = np.array(image)
    pixels = img_array.reshape(-1, 3)
    kmeans = KMeans(n_clusters=6, random_state=42)
    kmeans.fit(pixels)

    colors = []
    for center in kmeans.cluster_centers_:
        rgb = tuple(int(x) for x in center)
        colors.append(rgb)

    hex_colors = [rgb_to_hex(color) for color in colors]

    # Find closest pixel to each centroid
    height, width = img_array.shape[:2]
    locations = []
    for center in kmeans.cluster_centers_:
        # Calculate distance to each pixel
        distances = np.linalg.norm(pixels - center, axis=1)
        closest_idx = np.argmin(distances)

        # Convert flat index to x,y coordinates
        y = (closest_idx // width) / height * 100
        x = (closest_idx % width) / width * 100
        locations.append([float(x), float(y)])

    return [
        {"color": color, "percent_location": loc}
        for color, loc in zip(hex_colors, locations)
    ]
