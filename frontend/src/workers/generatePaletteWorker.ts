// In /frontend/src/workers/generatePaletteWorker.ts

import type { TGeneratePaletteResponse } from '../types'
import kmeans from '../utils/kmeans'

type MessageFromReact = {
  id: string
  photoUrl: string
}

type MessageFromWorker = TGeneratePaletteResponse

self.onmessage = async (event: MessageEvent<MessageFromReact>) => {
  const { id, photoUrl } = event.data
  const blob = await fetch(photoUrl).then((res) => res.blob())
  const response: MessageFromWorker = await kmeans(blob)
  self.postMessage({ id, response })
}
