import type { TGeneratePaletteResponse } from '../types'
import kmeans from '../utils/kmeans'

// If I use multiple works in the future these could be expanded.
type MessageFromReact = {
  id: string
  photoUrl: string
}

// If I use multiple works in the future these could be expanded.
type MessageFromWorker = TGeneratePaletteResponse

const resizeImage = async (blob: Blob, maxSize: number): Promise<Blob> => {
  const imageBitmap = await createImageBitmap(blob)
  const { width, height } = imageBitmap

  let targetWidth = width
  let targetHeight = height

  if (width > height) {
    if (width > maxSize) {
      targetWidth = maxSize
      targetHeight = (height / width) * maxSize
    }
  } else {
    if (height > maxSize) {
      targetHeight = maxSize
      targetWidth = (width / height) * maxSize
    }
  }

  const offscreen = new OffscreenCanvas(targetWidth, targetHeight)
  const ctx = offscreen.getContext('2d')
  if (!ctx) throw new Error('No 2D context')
  ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight)
  return offscreen.convertToBlob()
}

self.onmessage = async (event: MessageEvent<MessageFromReact>) => {
  const { id, photoUrl } = event.data
  const blob = await fetch(photoUrl).then((res) => res.blob())
  const resizedBlob = await resizeImage(blob, 256)
  const response: MessageFromWorker = await kmeans(resizedBlob)
  self.postMessage({ id, response })
}
