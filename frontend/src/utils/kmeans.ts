// kmeans.worker.ts
import skmeans from 'skmeans'
import type { TGeneratedSwatch, TGeneratePaletteResponse } from '../types'
import { PALETTE_SIZE } from '../consts'
import { logger } from '../services/logging'

type Pixel = {
  rgb: [number, number, number]
  percentLocation: [number, number]
}

async function blobToImageData(blob: Blob): Promise<ImageData> {
  // Decode the blob into an ImageBitmap
  const bitmap = await createImageBitmap(blob)

  // Use OffscreenCanvas to draw it
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2D context')

  ctx.drawImage(bitmap, 0, 0)
  return ctx.getImageData(0, 0, bitmap.width, bitmap.height)
}

function imageDataToPixels(imageData: ImageData): Pixel[] {
  const { data, width, height } = imageData
  const pixels: Pixel[] = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      pixels.push({
        rgb: [data[i], data[i + 1], data[i + 2]],
        percentLocation: [(x / width) * 100, (y / height) * 100],
      })
    }
  }

  return pixels
}

const rgbToHex = (rgb: number[]) =>
  `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`

const sqDist = (a: number[], b: number[]) =>
  (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2

async function kmeans(blob: Blob): Promise<TGeneratePaletteResponse> {
  try {
    const imageData = await blobToImageData(blob)
    const pixels = imageDataToPixels(imageData)

    const rgbData = pixels.map((p) => p.rgb)
    const result = skmeans(rgbData, PALETTE_SIZE)

    const palette: TGeneratedSwatch[] = result.centroids.map(
      (centroid, clusterIdx) => {
        let bestPixel: Pixel | null = null
        let bestDist = Infinity

        for (let i = 0; i < pixels.length; i++) {
          const p = pixels[i]
          if (result.idxs[i] === clusterIdx) {
            const d = sqDist(p.rgb, centroid)
            if (d < bestDist) {
              bestDist = d
              bestPixel = p
            }
          }
        }

        return {
          color: rgbToHex(centroid),
          percentLocation: bestPixel ? bestPixel.percentLocation : [0, 0],
        }
      }
    )

    return { success: true, palette }
  } catch (error) {
    logger.error(error)
    return { success: false, message: 'Failed to generate palette' }
  }
}

export default kmeans
