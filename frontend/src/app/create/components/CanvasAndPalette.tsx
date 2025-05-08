'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { TGeneratedPalette } from '../../../types'
import DraggableSwatch from './DraggableSwatch'
import ReadonlyPalette from './ReadonlyPalette'

const CanvasAndPalette = ({
  palette,
  handlePaletteChange,
  photo,
}: {
  palette: TGeneratedPalette
  handlePaletteChange: (palette: TGeneratedPalette) => void
  photo: File | null
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [hoveringIndex, setHoveringIndex] = useState<number | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 1,
    height: 1,
  })
  const handleSetDraggingIndex = useCallback((index: number) => {
    setDraggingIndex(index)
  }, [])

  const sampleColorAtPosition = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    // Clamp to canvas dimensions
    const pixelX = Math.max(0, Math.min(canvas.width - 1, x * scaleX))
    const pixelY = Math.max(0, Math.min(canvas.height - 1, y * scaleY))

    const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data
    return `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`
  }, [])

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggingIndex === null) return

      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()

      // Clamp coordinates to container bounds
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))

      const newColor = sampleColorAtPosition(
        Math.max(0, Math.min(rect.width, e.clientX - rect.left)),
        Math.max(0, Math.min(rect.height, e.clientY - rect.top))
      )
      if (!newColor) return

      const newPalette = [...palette]
      newPalette[draggingIndex] = {
        color: newColor,
        percentLocation: [x, y],
      }
      handlePaletteChange(newPalette)
    },
    [draggingIndex, palette, sampleColorAtPosition, handlePaletteChange]
  )

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      // Check if click is near any circle
      const index = palette.findIndex(swatch => {
        const circleX = swatch.percentLocation[0]
        const circleY = swatch.percentLocation[1]
        const distance = Math.sqrt(Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2))
        return distance < 5 // 5% threshold for clicking
      })

      if (index !== -1) {
        setDraggingIndex(index)
      }
    },
    [palette]
  )

  const handleCanvasMouseUp = useCallback(() => {
    setDraggingIndex(null)
  }, [])

  const setPhotoOnCanvas = useCallback((photo: File) => {
    const image = new Image()
    image.src = URL.createObjectURL(photo)
    image.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = image.width
      canvas.height = image.height
      setImageDimensions({ width: image.width, height: image.height })

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(image, 0, 0, image.width, image.height)
      // setImageData(canvas.toDataURL())

      URL.revokeObjectURL(image.src)
    }
  }, [])

  useEffect(() => {
    if (photo) {
      setPhotoOnCanvas(photo)
    }
  }, [photo, setPhotoOnCanvas])

  const isLandscape = imageDimensions.width > imageDimensions.height

  return (
    <>
      <div
        ref={containerRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        style={{
          width: '100%',
          height: '70vh',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <canvas
          style={{
            display: 'block',
            ...(!isLandscape && {
              height: '100%',
            }),
            ...(isLandscape && {
              width: '100%',
            }),
            aspectRatio: imageDimensions.width / imageDimensions.height,
          }}
          ref={canvasRef}
        />
        {palette.map((swatch, index) => (
          <DraggableSwatch
            isHovered={hoveringIndex === index}
            key={`${swatch.color}-${index}`}
            swatch={swatch}
            index={index}
            handleSetDraggingIndex={handleSetDraggingIndex}
          />
        ))}
      </div>
      <ReadonlyPalette palette={palette} setHoveringIndex={setHoveringIndex} />
    </>
  )
}

export default CanvasAndPalette
