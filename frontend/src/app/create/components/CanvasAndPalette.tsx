'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Palette } from '../../../types'
import { HEIGHT, WIDTH } from '../consts'
import DraggableSwatch from './DraggableSwatch'

const CanvasAndPalette = ({
  palette,
  handlePaletteChange,
  photo,
}: {
  palette: Palette
  handlePaletteChange: (palette: Palette) => void
  photo: File | null
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  // const [imageData, setImageData] = useState<string | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(
    null
  )
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
    const pixelX = x * scaleX
    const pixelY = y * scaleY
    const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data
    return `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`
  }, [])

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggingIndex === null) return

      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      const newColor = sampleColorAtPosition(e.clientX - rect.left, e.clientY - rect.top)
      if (!newColor) return

      const newPalette = [...palette]
      newPalette[draggingIndex] = {
        color: newColor,
        percent_location: [x, y],
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
        const circleX = swatch.percent_location[0]
        const circleY = swatch.percent_location[1]
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

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: `${WIDTH}px`,
          maxHeight: `${HEIGHT}px`,
          position: 'relative',
          aspectRatio: imageDimensions
            ? `${imageDimensions.width} / ${imageDimensions.height}`
            : '1',
        }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        <canvas
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
          ref={canvasRef}
        />
        {palette.map((swatch, index) => (
          <DraggableSwatch
            key={swatch.color}
            swatch={swatch}
            index={index}
            handleSetDraggingIndex={handleSetDraggingIndex}
          />
        ))}
      </div>
      {palette.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {palette.map(swatch => (
            <div
              key={swatch.color}
              style={{
                width: '75px',
                height: '25px',
                backgroundColor: swatch.color,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '12px',
              }}
            >
              <span style={{ color: 'white' }}>{swatch.color}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default CanvasAndPalette
