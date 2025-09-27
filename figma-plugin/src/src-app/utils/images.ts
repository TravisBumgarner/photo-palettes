export const resizeImage = (
  file: File,
  { maxWidth, maxHeight }: { maxWidth: number; maxHeight: number }
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Maintain aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context not available"));

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Conversion to blob failed"));
        },
        "image/jpeg",
        0.8 // quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export async function photoUrlToBlob(photoUrl: string): Promise<Blob> {
  const response = await fetch(photoUrl, { mode: "cors" });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}`
    );
  }
  return await response.blob();
}
