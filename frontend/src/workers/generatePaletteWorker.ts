import type { TGeneratePaletteResponse } from '../types'
import kmeans from '../utils/kmeans'

// If I use multiple works in the future these could be expanded.
type MessageFromReact = {
  id: string
  photoUrl: string
}

// If I use multiple works in the future these could be expanded.
type MessageFromWorker = TGeneratePaletteResponse

self.onmessage = async (event: MessageEvent<MessageFromReact>) => {
  const { id, photoUrl } = event.data
  const blob = await fetch(photoUrl).then((res) => res.blob())
  const response: MessageFromWorker = await kmeans(blob)
  self.postMessage({ id, response })
}
