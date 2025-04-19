import json

import numpy as np
from fastapi import UploadFile
from PIL import Image
from sklearn.cluster import KMeans


def get_image_colors(photo: UploadFile) -> list:
    # Read the file content
    content = photo.file.read()
    # Create a BytesIO object
    from io import BytesIO

    image_bytes = BytesIO(content)
    # Open the image from bytes
    image = Image.open(image_bytes)
    # Convert to RGB if needed
    if image.mode != "RGB":
        image = image.convert("RGB")
    # Resize for faster processing
    image = image.resize((100, 100))
    # Convert to numpy array
    img_array = np.array(image)
    # Reshape for kmeans
    pixels = img_array.reshape(-1, 3)
    # Run kmeans
    kmeans = KMeans(n_clusters=6, random_state=42)
    kmeans.fit(pixels)
    # Get the colors
    colors = kmeans.cluster_centers_.astype(int)
    # Convert to hex
    hex_colors = [f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}" for color in colors]
    # Get the locations
    locations = []
    for i in range(6):
        x = (i % 3) * 33 + 16
        y = (i // 3) * 33 + 16
        locations.append([float(x), float(y)])
    # Return the palette
    return [
        {"color": color, "percent_location": loc}
        for color, loc in zip(hex_colors, locations)
    ]


def sync_palettes(photo: UploadFile):
    colors = get_image_colors(photo)
    return colors


if __name__ == "__main__":
    print("\tRunning sync_palettes")
    sync_palettes()
