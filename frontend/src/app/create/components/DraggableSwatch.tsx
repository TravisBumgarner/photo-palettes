import { motion } from 'framer-motion'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import { useDrag } from '@use-gesture/react'
import {
  BORDER_WIDTH,
  CENTER_PIXEL_INDEX,
  NUMBER_OF_PIXELS_IN_PREVIEW,
  PIXEL_SIDE_LENGTH,
} from './shared'

const SIDE_LENGTH = PIXEL_SIDE_LENGTH * 3 + BORDER_WIDTH * 2
const SIDE_LENGTH_SCALED = SIDE_LENGTH * 3

const ACTIVE_STYLES = {
  width: `${SIDE_LENGTH_SCALED}px`,
  height: `${SIDE_LENGTH_SCALED}px`,
}

const INACTIVE_STYLES = {
  width: `${SIDE_LENGTH}px`,
  height: `${SIDE_LENGTH}px`,
}

const DraggableSwatch = forwardRef<
  HTMLDivElement,
  {
    startingPosition: [number, number]
    index: number
    isActive: boolean
    setActiveIndex: (index: number | null) => void
    canvasContainerRef: React.RefObject<HTMLDivElement | null>
    canvasRef: React.RefObject<HTMLCanvasElement | null>
    readyToDrawSwatches: boolean
    updateSwatch: (index: number, color: string) => void
  }
>(
  (
    {
      index,
      isActive,
      setActiveIndex,
      canvasContainerRef,
      canvasRef,
      startingPosition,
      updateSwatch,
      readyToDrawSwatches,
    },
    ref
  ) => {
    const [neighbors, setNeighbors] = useState<string[]>([])
    const [position, setPosition] = useState<{ left: number; top: number }>({
      left: startingPosition[0],
      top: startingPosition[1],
    })

    const sampleColorAtPosition = useCallback(
      (x: number, y: number) => {
        const canvas = canvasRef.current
        if (!canvas) return '#FF00FF'

        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return '#FFFF00'

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        // Clamp to canvas dimensions
        const pixelX = Math.max(0, Math.min(canvas.width - 1, x * scaleX))
        const pixelY = Math.max(0, Math.min(canvas.height - 1, y * scaleY))

        const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data
        return `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`
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
        return coordinates.map(position => sampleColorAtPosition(...position))
      },
      [sampleColorAtPosition]
    )

    useEffect(() => {
      // Update pixel's neighbors when dragging or hovering over a swatch.

      const container = canvasContainerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const newColors = sampleColorsAtPosition(
        (rect.width * position.left) / 100,
        (rect.height * position.top) / 100
      )
      setNeighbors(newColors)
      // This next line adds an infinite rerender. If I'm going to add it back in I need a better solution.
      // updateSwatch(index, newColors[CENTER_PIXEL_INDEX])
    }, [
      sampleColorsAtPosition,
      canvasContainerRef,
      index,
      position.left,
      position.top,
      readyToDrawSwatches,
      // updateSwatch,
    ])

    const bind = useDrag(({ first, active, last, xy: [clientX, clientY] }) => {
      if (!canvasContainerRef.current) return

      if (first) {
        setActiveIndex(index)
      }

      if (active) {
        const rect = canvasContainerRef.current.getBoundingClientRect()
        const left = ((clientX - rect.left) / rect.width) * 100
        const top = ((clientY - rect.top) / rect.height) * 100
        setPosition({ left, top })
      }

      if (last) {
        updateSwatch(index, neighbors[CENTER_PIXEL_INDEX])
        setActiveIndex(null)
      }
    })

    return (
      <motion.div
        ref={ref}
        whileHover={ACTIVE_STYLES}
        whileDrag={ACTIVE_STYLES}
        initial={{
          ...INACTIVE_STYLES,
          x: '-50%',
          y: '-50%',
        }}
        animate={isActive ? ACTIVE_STYLES : INACTIVE_STYLES}
        style={{
          position: 'absolute',
          left: `${position.left}%`,
          top: `${position.top}%`,
          cursor: 'none',
          border: `2px solid black`,
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          touchAction: 'none',
          zIndex: isActive ? 2 : 1,
        }}
      >
        <div
          {...bind()}
          style={{
            display: 'contents',
            touchAction: 'none',
          }}
        >
          {neighbors.map((neighbor, i) => (
            <div
              key={i}
              style={{
                border: isActive
                  ? `0.5px solid color-mix(in srgb, ${neighbor} ${i === CENTER_PIXEL_INDEX ? '20%' : '80%'}, white ${i === CENTER_PIXEL_INDEX ? '80%' : '20%'})`
                  : `0.5px solid ${neighbor}`,
                backgroundColor: neighbor,
              }}
            />
          ))}
        </div>
      </motion.div>
    )
  }
)

DraggableSwatch.displayName = 'DraggableSwatch'

export default DraggableSwatch
