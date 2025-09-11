import { getContrastColor } from './getContrastColor'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'

import { Capacitor } from '@capacitor/core'

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const dataUrl = reader.result as string
      resolve(dataUrl.split(',')[1]) // strip "data:image/png;base64,"
    }
    reader.readAsDataURL(blob)
  })

const downloadNative = async (paletteId: string, blob: Blob) => {
  const result = await Filesystem.writeFile({
    path: `${paletteId}.png`,
    data: await blobToBase64(blob), // blobs supported web only.
    directory: Directory.Documents,
  })
  alert(result.uri)

  await Share.share({
    title: 'Save your palette',
    text: 'Created with Photo Palettes',
    url: result.uri, // Native file URI
    dialogTitle: 'Share Palette',
  })
}

const downloadWeb = (paletteId: string, blob: Blob) => {
  const url = URL.createObjectURL(blob)

  // Trigger download
  const a = document.createElement('a')
  a.href = url
  a.download = `${paletteId}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  Filesystem.writeFile({
    path: 'foo.jpg',
    data: blob,
  })
}

const downloadPalette = async ({
  paletteId,
  photoUrl,
  colors: colors,
  options,
}: {
  paletteId: string
  photoUrl: string
  colors: string[]
  options?: { width?: number; height?: number }
}) => {
  if (colors.length !== 6) throw new Error('Must provide exactly 6 hex colors.')

  // Load image
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = photoUrl
  })

  const width = options?.width || img.width
  const height = options?.height || img.height
  const barHeight = Math.round(height * 0.12)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height + barHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  // Draw photo
  ctx.drawImage(img, 0, 0, width, height)

  // Add attribution line between photo and palette
  const attributionFontSize = Math.max(Math.round(barHeight * 0.22), 12)
  const attributionPadding = 10
  ctx.font = `${attributionFontSize}px sans-serif`
  ctx.fillStyle = '#FFF'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(
    'Created with photopalettes.com',
    attributionPadding,
    height + attributionPadding
  )

  // Draw color boxes
  for (let i = 0; i < 6; i++) {
    const x1 = Math.round((i * width) / 6)
    const x2 = Math.round(((i + 1) * width) / 6)
    const boxWidth = x2 - x1

    ctx.fillStyle = colors[i]
    ctx.fillRect(
      x1,
      height + attributionFontSize + attributionPadding * 2,
      boxWidth,
      barHeight - attributionFontSize - attributionPadding * 2
    )

    // Font size: maximize to fit box
    let fontSize = barHeight * 0.5
    ctx.font = `bold ${fontSize}px sans-serif`
    const text = colors[i].toUpperCase()
    let metrics = ctx.measureText(text)
    while (metrics.width > boxWidth * 0.9 && fontSize > 10) {
      fontSize -= 5 // Yay magic numbers.
      ctx.font = `bold ${fontSize}px sans-serif`
      metrics = ctx.measureText(text)
    }

    // Center text
    ctx.fillStyle = getContrastColor(colors[i])
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      text,
      x1 + boxWidth / 2,
      height +
        attributionFontSize +
        attributionPadding * 2 +
        (barHeight - attributionFontSize - attributionPadding * 2) / 2
    )
  }

  canvas.toBlob((blob) => {
    if (!blob) return

    if (Capacitor.isNativePlatform()) {
      downloadNative(paletteId, blob)
    } else {
      // Web
      downloadWeb(paletteId, blob)
    }
  })
}

export default downloadPalette
