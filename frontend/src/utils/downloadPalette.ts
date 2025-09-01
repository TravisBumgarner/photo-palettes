import { getContrastColor } from './index'

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

  // Draw color boxes
  for (let i = 0; i < 6; i++) {
    const x1 = Math.round((i * width) / 6)
    const x2 = Math.round(((i + 1) * width) / 6)
    const boxWidth = x2 - x1

    ctx.fillStyle = colors[i]
    ctx.fillRect(x1, height, boxWidth, barHeight)

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
    ctx.fillText(text, x1 + boxWidth / 2, height + barHeight / 2)
  }

  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)

    // Trigger download
    const a = document.createElement('a')
    a.href = url
    a.download = `${paletteId}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    // Clean up
    URL.revokeObjectURL(url)
  }, 'image/png')
}

export default downloadPalette
