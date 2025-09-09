from instagrapi import Client
import dotenv

dotenv.load_dotenv()


import os

cl = Client()
INSTAGRAM_USERNAME = os.getenv("INSTAGRAM_USERNAME")
INSTAGRAM_PASSWORD = os.getenv("INSTAGRAM_PASSWORD")
cl.login(INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD)

cl.album_upload

def post_image(cl, image_paths, caption):
    cl.album_upload(paths=image_paths, caption=caption)
    print(f"Posted image: {image_paths}")
    return


post_image(
    cl, ["photos/1.jpg", "photos/2.jpg", "photos/3.jpg"], "Check out these images!"
)
