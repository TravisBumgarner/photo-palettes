'use client'

// Some Notes on this File.
// - Preact Signals don't seem to work with NextJS.
// - Storing the palette in Zustand causes mobile to not work on drag.
// - Now we use lots of refs to control all the colors.

import { Box, rgbToHex } from '@mui/material'
import { useDrag } from '@use-gesture/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SPACING } from '../../../styles/Theme'
import { TGeneratedPalette, TSwatch } from '../../../types'
import { getContrastColor } from '../../../utils'
import DraggableSwatch from './DraggableSwatch'
import ReadonlySwatch from './ReadonlySwatch'
import { sharedCSS, SWATCH_SIZE } from './shared'

const CanvasAndPalette = ({
  photo,
  palette,
  updatePalette,
}: {
  photo: File | null
  palette: TGeneratedPalette | null
  updatePalette: (palette: TGeneratedPalette) => void
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const draggableSwatchRefs = useRef<(HTMLDivElement | null)[]>([])
  const readonlySwatchRefs = useRef<(HTMLDivElement | null)[]>([])
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [hoveringIndex, setHoveringIndex] = useState<number | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 1,
    height: 1,
  })

  const sampleColorAtPosition = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
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

  const updateSwatch = useCallback((index: number, swatch: TSwatch) => {
    const draggableSwatchRef = draggableSwatchRefs.current[index]
    const readonlySwatchRef = readonlySwatchRefs.current[index]

    if (!draggableSwatchRef || !readonlySwatchRef) return
    draggableSwatchRef.style.backgroundColor = swatch.color.toUpperCase()
    draggableSwatchRef.style.left = `${swatch.percentLocation[0]}%`
    draggableSwatchRef.style.top = `${swatch.percentLocation[1]}%`

    readonlySwatchRef.style.backgroundColor = swatch.color.toUpperCase()
    readonlySwatchRef.style.color = getContrastColor(swatch.color)
    readonlySwatchRef.innerHTML = swatch.color.toUpperCase()
  }, [])

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (draggingIndex === null) return

      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()

      // Clamp absolute coordinates to container bounds
      const x = Math.max(
        0,
        Math.min(rect.width - SWATCH_SIZE, clientX - rect.left - SWATCH_SIZE / 2)
      )
      const y = Math.max(
        0,
        Math.min(rect.height - SWATCH_SIZE, clientY - rect.top - SWATCH_SIZE / 2)
      )

      const newColor = sampleColorAtPosition(x, y)
      if (!newColor) return

      updateSwatch(draggingIndex, {
        color: newColor,
        percentLocation: [(x / rect.width) * 100, (y / rect.height) * 100],
      })
    },
    [draggingIndex, sampleColorAtPosition, updateSwatch]
  )

  useEffect(() => {
    if (palette) {
      palette.forEach((swatch, index) => {
        updateSwatch(index, swatch)
      })
    }
  }, [palette, updateSwatch])

  const handleStart = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current
    if (!container) return

    // Check if click is on any palette element
    const index = draggableSwatchRefs.current.findIndex(ref => {
      if (!ref) return false
      const rect = ref.getBoundingClientRect()
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      )
    })

    if (index !== -1) {
      setDraggingIndex(index)
    }
  }, [])

  const handleEnd = useCallback(() => {
    setDraggingIndex(null)
    updatePalette(
      draggableSwatchRefs.current.map(swatch => ({
        color: rgbToHex(swatch?.style.backgroundColor || ''),
        percentLocation: [
          parseFloat(swatch?.style.left || '0'),
          parseFloat(swatch?.style.top || '0'),
        ],
      }))
    )
  }, [updatePalette])

  const setPhotoOnCanvas = useCallback((photo: File) => {
    const image = new Image()
    image.src = URL.createObjectURL(photo)
    image.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = image.width
      canvas.height = image.height
      setImageDimensions({ width: image.width, height: image.height })

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      ctx.drawImage(image, 0, 0, image.width, image.height)
      URL.revokeObjectURL(image.src)
    }
  }, [])

  useEffect(() => {
    if (photo) {
      setPhotoOnCanvas(photo)
    }
  }, [photo, setPhotoOnCanvas])

  const setDraggableSwatchRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      draggableSwatchRefs.current[index] = el
    },
    []
  )

  const setReadonlySwatchRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      readonlySwatchRefs.current[index] = el
    },
    []
  )

  const bind = useDrag(
    ({ active, first, last, xy: [x, y] }) => {
      if (first) {
        handleStart(x, y)
      }
      if (active) {
        handleMove(x, y)
      }
      if (last) {
        handleEnd()
      }
    },
    {
      filterTaps: true,
      preventScroll: true,
      pointer: { touch: true },
    }
  )

  return (
    <>
      <Box
        sx={{
          ...sharedCSS,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: SPACING.SMALL.PX,
          touchAction: 'none',
        }}
      >
        <div
          ref={containerRef}
          {...bind()}
          style={{
            touchAction: 'none',
            position: 'relative',
            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: imageDimensions.width / imageDimensions.height,
          }}
        >
          <canvas
            style={{
              touchAction: 'none',
              display: 'block',
              maxWidth: '100%',
              maxHeight: '100%',
              aspectRatio: imageDimensions.width / imageDimensions.height,
            }}
            ref={canvasRef}
          />
          {new Array(6).fill(null).map((_, index) => (
            <DraggableSwatch
              ref={setDraggableSwatchRef(index)}
              isHovering={hoveringIndex === index}
              isDragging={draggingIndex === index}
              key={index}
            />
          ))}
        </div>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          margin: '0 auto',
          '@media (max-width: 700px)': {
            width: '300px',
            flexWrap: 'wrap',
          },
        }}
      >
        {new Array(6).fill(null).map((_, index) => (
          <ReadonlySwatch
            key={index}
            ref={setReadonlySwatchRef(index)}
            index={index}
            handleMouseEnterCallback={setHoveringIndex}
            handleMouseLeaveCallback={setHoveringIndex}
          />
        ))}
      </Box>
    </>
  )
}

export default CanvasAndPalette
