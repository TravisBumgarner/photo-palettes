'use client'

// Some Notes on this File.
// - Preact Signals don't seem to work with NextJS.
// - Storing the palette in Zustand causes mobile to not work on drag.
// - Now we use lots of refs to control all the colors.

import { Box, rgbToHex } from '@mui/material'
import { useDrag } from '@use-gesture/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SPACING } from '../../../styles/styleConsts'
import { TGeneratedPalette, TSwatch } from '../../../types'
import { getContrastColor } from '../../../utils'
import DraggableSwatch from './DraggableSwatch'
import ReadonlySwatch from './ReadonlySwatch'
import {
  BORDER_WIDTH,
  CENTER_PIXEL_INDEX,
  NUMBER_OF_PIXELS_IN_PREVIEW,
  PIXEL_SIDE_LENGTH,
  sharedCSS,
} from './shared'

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
  const [neighbors, setNeighbors] = useState<string[]>([])
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 1,
    height: 1,
  })
  const sampleColorAtPosition = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return '#000000'

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return '#000000'

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    // Clamp to canvas dimensions
    const pixelX = Math.max(0, Math.min(canvas.width - 1, x * scaleX))
    const pixelY = Math.max(0, Math.min(canvas.height - 1, y * scaleY))

    const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data
    return `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`
  }, [])

  const getGridCoordinates = (x: number, y: number, N: number) => {
    const half = Math.floor(N / 2)
    const coords: [number, number][] = []
    for (let dy = -half; dy <= half; dy++) {
      for (let dx = -half; dx <= half; dx++) {
        coords.push([x + dx, y + dy])
      }
    }
    return coords
  }

  const sampleColorsAtPosition = useCallback(
    (x: number, y: number) => {
      const coordinates = getGridCoordinates(x, y, NUMBER_OF_PIXELS_IN_PREVIEW)
      return coordinates.map(position => sampleColorAtPosition(...position))
    },
    [sampleColorAtPosition]
  )

  const updateSwatch = useCallback((index: number, swatch: TSwatch) => {
    const draggableSwatchRef = draggableSwatchRefs.current[index]
    const readonlySwatchRef = readonlySwatchRefs.current[index]

    if (!draggableSwatchRef || !readonlySwatchRef) return
    // draggableSwatchRef.style.backgroundColor = swatch.color.toUpperCase()
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

      const swatchSize = PIXEL_SIDE_LENGTH * 3 + 2 * BORDER_WIDTH
      const swatchCenter = swatchSize / 2

      const xRect = clientX - rect.left - swatchCenter
      const yRect = clientY - rect.top - swatchCenter

      const newColors = sampleColorsAtPosition(xRect, yRect)
      updateSwatch(draggingIndex, {
        color: newColors[CENTER_PIXEL_INDEX],
        percentLocation: [(xRect / rect.width) * 100, (yRect / rect.height) * 100],
      })
      setNeighbors(newColors)
    },
    [draggingIndex, updateSwatch, sampleColorsAtPosition]
  )

  useEffect(() => {
    // Update neighbors when dragging or hovering over a swatch.
    let indexLookup: number | null = null
    if (draggingIndex !== null) indexLookup = draggingIndex
    if (hoveringIndex !== null) indexLookup = hoveringIndex
    if (indexLookup === null) {
      setNeighbors([])
      return
    }
    if (!palette) return

    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const swatch = palette[indexLookup]
    const newColors = sampleColorsAtPosition(
      (rect.width * swatch.percentLocation[0]) / 100,
      (rect.height * swatch.percentLocation[1]) / 100
    )
    setNeighbors(newColors)
  }, [draggingIndex, hoveringIndex, palette, sampleColorsAtPosition, updateSwatch, updatePalette])

  useEffect(() => {
    // Draw swatches on screen on load.
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
  }, [draggableSwatchRefs, updatePalette])

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
              isActive={hoveringIndex === index || draggingIndex === index}
              neighbors={neighbors}
              key={index}
              index={index}
              handleMouseEnterCallback={setHoveringIndex}
              handleMouseLeaveCallback={setHoveringIndex}
            />
          ))}
        </div>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          '& > *': {
            flex: '1 0 16.66%', // 6 per row by default
            boxSizing: 'border-box',
          },
          '@media (max-width: 700px)': {
            '& > *': {
              flex: '1 0 33.33%', // 3 per row at <=700px
            },
          },
        }}
      >
        {new Array(6).fill(null).map((_, index) => (
          <ReadonlySwatch
            key={index}
            ref={setReadonlySwatchRef(index)}
            index={index}
            isActive={hoveringIndex === index || draggingIndex === index}
            handleMouseEnterCallback={setHoveringIndex}
            handleMouseLeaveCallback={setHoveringIndex}
          />
        ))}
      </Box>
    </>
  )
}

export default CanvasAndPalette
