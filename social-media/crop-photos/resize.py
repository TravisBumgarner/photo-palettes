import os
import shutil

from PIL import Image, ImageChops, UnidentifiedImageError

IMG_EXTS = {".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tiff"}
CROP = 300


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


def process_images():
    outdir = "output"
    indir = "input"
    if os.path.exists(outdir):
        shutil.rmtree(outdir)
    os.makedirs(outdir)
    if not os.path.exists(indir):
        return
    for fname in os.listdir(indir):
        base, ext = os.path.splitext(fname)
        if ext.lower() not in IMG_EXTS:
            continue
        fpath = os.path.join(indir, fname)
        try:
            img = Image.open(fpath).convert("RGB")
        except (UnidentifiedImageError, OSError):
            continue
        img = crop_white(img)
        img = pad_to_square_with_min_padding(img, min_pad=30)
        outname = os.path.join(outdir, fname)
        img.save(outname)


if __name__ == "__main__":
    process_images()
