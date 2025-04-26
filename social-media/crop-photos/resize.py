import os
import shutil

from PIL import Image, ImageChops, UnidentifiedImageError

IMG_EXTS = {".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tiff"}
CROP = 300


def crop_top_row(img):
    # Apple is adding 1 row of black pixels to the top of the image. Bug?
    w, h = img.size
    return img.crop((0, 1, w, h))


def crop_white(img):
    bg = Image.new(img.mode, img.size, (255, 255, 255))
    diff = Image.eval(ImageChops.difference(img, bg), lambda x: 255 if x > 10 else 0)
    bbox = diff.getbbox()
    if bbox:
        return img.crop(bbox)
    return img


def pad_to_square_with_min_padding(img, min_pad=30):
    w, h = img.size
    size = max(w, h) + 2 * min_pad
    out_size = max(size, w, h)  # never smaller than input
    new_img = Image.new("RGB", (out_size, out_size), (255, 255, 255))
    left = (out_size - w) // 2
    top = (out_size - h) // 2
    new_img.paste(img, (left, top))
    return new_img


def crop_200(img):
    w, h = img.size
    if w <= 2 * CROP or h <= 2 * CROP:
        return None
    return img.crop((CROP, CROP, w - CROP, h - CROP))


# starting index of seis colores


def process_images():
    counter = 36
    outdir = "output"
    indir = "input"
    if os.path.exists(outdir):
        shutil.rmtree(outdir)
    os.makedirs(outdir)
    if not os.path.exists(indir):
        print(f"Input directory '{indir}' does not exist")
        return

    print(f"Looking for images in '{indir}'")

    # Get all image files and sort them by filename (which contains date)
    image_files = []
    for fname in os.listdir(indir):
        base, ext = os.path.splitext(fname)
        if ext.lower() not in IMG_EXTS:
            continue
        print(f"Found image: {fname}")
        image_files.append(fname)

    # Sort filenames (which will sort by date since they contain date)
    image_files.sort()

    print(f"Found {len(image_files)} images")

    # Process sorted files
    for fname in image_files:
        fpath = os.path.join(indir, fname)
        try:
            img = Image.open(fpath).convert("RGB")
        except (UnidentifiedImageError, OSError):
            print(f"Error opening {fpath}")
            continue
        img = crop_top_row(img)  # Crop 1 row of pixels from the top
        img = crop_white(img)
        img = pad_to_square_with_min_padding(img, min_pad=30)
        outname = os.path.join(outdir, f"{counter:03d}_{fname}")
        img.save(outname)
        print(f"Saved {outname}")
        counter += 1


if __name__ == "__main__":
    process_images()
