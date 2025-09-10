import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { useDrag } from '@use-gesture/react'
import {
  BORDER_WIDTH,
  CENTER_PIXEL_INDEX,
  NUMBER_OF_PIXELS_IN_PREVIEW,
  PIXEL_SIDE_LENGTH,
} from './shared'

const SIDE_LENGTH = PIXEL_SIDE_LENGTH * 3 + BORDER_WIDTH * 2
const SIDE_LENGTH_SCALED = SIDE_LENGTH * 3

const DraggableSwatch = ({
  index,
  isActive,
  isHovered,
  setActiveIndex,
  canvasContainerRef,
  canvasRef,
  startingPercentLocation,
  updateSwatch,
  readyToDrawSwatches,
}: {
  startingPercentLocation: [number, number]
  index: number
  isActive: boolean
  isHovered: boolean
  setActiveIndex: (index: number | null) => void
  canvasContainerRef: React.RefObject<HTMLDivElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  readyToDrawSwatches: boolean
  updateSwatch: (
    index: number,
    color: string,
    percentLocation: [number, number]
  ) => void
}) => {
  const [neighbors, setNeighbors] = useState<string[]>([])
  const [percentLocation, setPercentLocation] = useState<{
    left: number
    top: number
  }>({
    left: startingPercentLocation[0],
    top: startingPercentLocation[1],
  })

  const sampleColorAtPosition = useCallback(
    (x: number, y: number) => {
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

      if (isNaN(pixelX) || isNaN(pixelY)) {
        // Not quite sure why this happens. Chrome handles it fine, safari does not.
        // Might be a race condition or alternatively there might be situations where
        // The size of the canvas is 0 due to variable layout.
        return '#000000'
      }

      const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data

      return `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`.toUpperCase()
    },
    [canvasRef]
  )

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
      return coordinates.map((position) => sampleColorAtPosition(...position))
    },
    [sampleColorAtPosition]
  )

  useEffect(() => {
    // Update pixel's neighbors when dragging or hovering over a swatch.

    const container = canvasContainerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()

    const newColors = sampleColorsAtPosition(
      (rect.width * percentLocation.left) / 100,
      (rect.height * percentLocation.top) / 100
    )

    setNeighbors(newColors)
    updateSwatch(index, newColors[CENTER_PIXEL_INDEX], [
      percentLocation.left,
      percentLocation.top,
    ])
  }, [
    sampleColorsAtPosition,
    canvasContainerRef,
    index,
    percentLocation.left,
    percentLocation.top,
    readyToDrawSwatches,
    updateSwatch,
  ])

  const bind = useDrag(({ first, active, last, xy: [clientX, clientY] }) => {
    if (!canvasContainerRef.current) return

    if (first) {
      setActiveIndex(index)
    }

    if (active) {
      const rect = canvasContainerRef.current.getBoundingClientRect()
      const left = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100)
      )
      const top = Math.max(
        0,
        Math.min(100, ((clientY - rect.top) / rect.height) * 100)
      )

      setPercentLocation({ left, top })
    }

    if (last) {
      updateSwatch(index, neighbors[CENTER_PIXEL_INDEX], [
        percentLocation.left,
        percentLocation.top,
      ])
      setActiveIndex(null)
    }
  })

  const handleMouseEnter = useCallback(() => {
    setActiveIndex(index)
  }, [index, setActiveIndex])

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null)
  }, [setActiveIndex])

  return (
    <div
      {...bind()}
      style={{
        display: 'contents',
        touchAction: 'none',
      }}
    >
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'absolute',
          left: `${percentLocation.left}%`,
          top: `${percentLocation.top}%`,
          x: '-50%',
          y: '-50%',
          width: SIDE_LENGTH,
        }}
        whileDrag={{
          width: SIDE_LENGTH_SCALED,
        }}
        whileHover={{
          width: SIDE_LENGTH_SCALED,
        }}
        initial={{
          width: SIDE_LENGTH,
        }}
        animate={{
          width: isHovered || isActive ? SIDE_LENGTH_SCALED : SIDE_LENGTH,
        }}
      >
        <div
          style={{
            width: '100%',
            aspectRatio: '1/1',
            cursor: 'none',
            border: `2px solid rgba(255, 255, 255, 0.9)`,
            overflow: 'hidden',
            boxShadow: '0 0 10px rgba(0,0,0,0.9)',
            backdropFilter: 'blur(10px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            touchAction: 'none',
            zIndex: isHovered || isActive ? 2 : 1,
          }}
        >
          {neighbors.map((neighbor, i) => (
            <div
              key={i}
              style={{
                border:
                  isActive || isHovered
                    ? `0.5px solid color-mix(in srgb, ${neighbor} ${i === CENTER_PIXEL_INDEX ? '20%' : '80%'}, white ${i === CENTER_PIXEL_INDEX ? '80%' : '20%'})`
                    : `0.5px solid ${neighbor}`,
                backgroundColor: neighbor,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

DraggableSwatch.displayName = 'DraggableSwatch'

export default DraggableSwatch
