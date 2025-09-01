import skmeans from 'skmeans'
import type { TGeneratedSwatch, TGeneratePaletteResponse } from '../../types'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../../services/logging'
import { PALETTE_SIZE } from '../../consts'

async function blobToClampedArray(blob: Blob): Promise<Uint8ClampedArray> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject('No 2d context')
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      resolve(imageData.data) // RGBA values
    }
    img.onerror = reject
    img.src = URL.createObjectURL(blob)
  })
}

function clampedArrayToPixels(
  data: Uint8ClampedArray,
  useAlpha = false
): number[][] {
  const stride = useAlpha ? 4 : 3 // how many channels per pixel
  const pixels: number[][] = []

  for (let i = 0; i < data.length; i += stride) {
    if (useAlpha) {
      pixels.push([data[i], data[i + 1], data[i + 2], data[i + 3]])
    } else {
      pixels.push([data[i], data[i + 1], data[i + 2]])
    }
  }

  return pixels
}

// function samplePixels(data: number[][], sampleSize = 250_000) {
//   if (data.length <= sampleSize) return data
//   const sampled: number[][] = []
//   for (let i = 0; i < sampleSize; i++) {
//     sampled.push(data[Math.floor(Math.random() * data.length)])
//   }
//   return sampled
// }

const rgbToHex = (rgb: number[]) => {
  return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

const kmeans = async (blob: Blob): Promise<TGeneratePaletteResponse> => {
  try {
    const clampedArray = await blobToClampedArray(blob)
    const pixels = clampedArrayToPixels(clampedArray)

    //   const sampled = samplePixels(data, sampleSize)
    const hexValues = skmeans(pixels, PALETTE_SIZE)
    const palette = hexValues.centroids.map((color): TGeneratedSwatch => {
      return {
        color: rgbToHex(color),
        percentLocation: [0, 0], // TTodo - Placeholder for percentLocation
      }
    })

    return {
      success: true,
      palette,
      paletteId: uuidv4(), // Todo - replace me.
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
