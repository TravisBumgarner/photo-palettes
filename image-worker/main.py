import time

from queries import get_next_image_worker

print("Starting image-worker...")


while True:
    obj = get_next_image_worker()
    print(f"Worker ready to process: {obj}")

    time.sleep(10)
