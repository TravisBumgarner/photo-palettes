from atproto import Client
import dotenv
import os

dotenv.load_dotenv()


client = Client()
client.login(os.getenv("BSKY_EMAIL"), os.getenv("BSKY_PASSWORD"))
post = client.send_post("Hello world! I posted this via the Python SDK.", langs=["en"])

with open("image.webp", "rb") as f:
    img_data = f.read()

client.send_image(
    text="New photo palette OG tags",
    image=img_data,
    image_alt="Red yellow and blue color palette",
)
