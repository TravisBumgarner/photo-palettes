const MAX_WIDTH = 1600
const MAX_HEIGHT = 1600

export const resizeImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img

      // Maintain aspect ratio
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context not available'))

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Conversion to blob failed'))
        },
        'image/jpeg',
        0.8 // quality
      )
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
