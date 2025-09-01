import skmeans from 'skmeans'
import type { TGeneratedSwatch, TGeneratePaletteResponse } from '../../types'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../../services/logging'
import { PALETTE_SIZE } from '../../consts'

async function blobToImageData(blob: Blob): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject('No 2d context')
      ctx.drawImage(img, 0, 0)
      resolve(ctx.getImageData(0, 0, img.width, img.height))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(blob)
  })
}

type Pixel = {
  rgb: [number, number, number]
  pos: [number, number] // normalized 0–1
}

function imageDataToPixels(imageData: ImageData): Pixel[] {
  const { data, width, height } = imageData
  const pixels: Pixel[] = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      pixels.push({
        rgb: [data[i], data[i + 1], data[i + 2]],
        pos: [(x / width) * 100, (y / height) * 100],
      })
    }
  }

  return pixels
}

const rgbToHex = (rgb: number[]) =>
  `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`

const sqDist = (a: number[], b: number[]) =>
  (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2

const kmeans = async (blob: Blob): Promise<TGeneratePaletteResponse> => {
  try {
    const imageData = await blobToImageData(blob)
    const pixels = imageDataToPixels(imageData)

    const rgbData = pixels.map((p) => p.rgb)

    const result = skmeans(rgbData, PALETTE_SIZE)

    const palette: TGeneratedSwatch[] = result.centroids.map(
      (centroid, clusterIdx) => {
        let bestPixel: Pixel | null = null
        let bestDist = Infinity

        pixels.forEach((p, i) => {
          if (result.idxs[i] === clusterIdx) {
            const d = sqDist(p.rgb, centroid)
            if (d < bestDist) {
              bestDist = d
              bestPixel = p
            }
          }
        })

        return {
          color: rgbToHex(centroid),
          percentLocation: bestPixel ? (bestPixel as Pixel).pos : [0, 0], // Something is cursed about ['pos'] vs .pos. I give up.
        }
      }
    )

    return {
      success: true,
      palette,
      paletteId: uuidv4(),
    }
  } catch (error) {
    logger.error('Error generating palette:', error)
    return {
      success: false,
      message: 'Failed to generate palette',
    }
  }
}

export default kmeans
