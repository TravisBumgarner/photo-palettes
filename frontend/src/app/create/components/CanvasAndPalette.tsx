'use client'

import { Box } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import useGlobalStore from '../../../store'
import { SPACING } from '../../../styles/Theme'
import DraggableSwatch from './DraggableSwatch'
import ReadonlyPalette from './ReadonlyPalette'

const CanvasAndPalette = ({ photo }: { photo: File | null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const swatchRefs = useRef<(HTMLDivElement | null)[]>([])
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [hoveringIndex, setHoveringIndex] = useState<number | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 1,
    height: 1,
  })
  const newPalette = useGlobalStore(state => state.newPalette)
  const updateNewPalette = useGlobalStore(state => state.updateNewPalette)

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

      updateNewPalette(draggingIndex, {
        color: newColor,
        percentLocation: [x, y],
      })
    },
    [draggingIndex, sampleColorAtPosition, updateNewPalette]
  )

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return

    // Check if click is on any palette element
    const index = swatchRefs.current.findIndex(ref => {
      if (!ref) return false
      const rect = ref.getBoundingClientRect()
      return (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      )
    })

    if (index !== -1) {
      setDraggingIndex(index)
    }
  }, [])

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

  // console.log('component rerenders', draggingIndex, hoveringIndex)

  const setRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      swatchRefs.current[index] = el
    },
    []
  )

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '70vh',
          '@media (max-width: 700px)': {
            height: '50vh',
          },
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: SPACING.SMALL.PX,
        }}
      >
        <div
          ref={containerRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          style={{
            position: 'relative',
            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: imageDimensions.width / imageDimensions.height,
            touchAction: 'none',
            cursor: draggingIndex !== null ? 'none' : 'default',
          }}
        >
          <canvas
            style={{
              display: 'block',
              maxWidth: '100%',
              maxHeight: '100%',
              aspectRatio: imageDimensions.width / imageDimensions.height,
            }}
            ref={canvasRef}
          />
          {newPalette!.map((swatch, index) => (
            <DraggableSwatch
              ref={setRef(index)}
              isHovering={hoveringIndex === index}
              isDragging={draggingIndex === index}
              key={`${swatch.color}-${index}`}
              swatch={swatch}
            />
          ))}
        </div>
      </Box>
      <ReadonlyPalette setHoveringIndex={setHoveringIndex} />
    </>
  )
}

export default CanvasAndPalette
