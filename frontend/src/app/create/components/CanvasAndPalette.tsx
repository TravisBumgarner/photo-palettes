'use client'

// Some Notes on this File.
// - Preact Signals don't seem to work with NextJS.
// - Storing the palette in Zustand causes mobile to not work on drag.
// - Now we use lots of refs to control all the colors.

import { Box } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SPACING } from '../../../styles/styleConsts'
import { TGeneratedPalette } from '../../../types'
import DraggableSwatch from './DraggableSwatch'
import ReadonlySwatch from './ReadonlySwatch'
import { sharedCSS } from './shared'

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
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const draggableSwatchRefs = useRef<(HTMLDivElement | null)[]>([])
  const readonlySwatchRefs = useRef<(HTMLDivElement | null)[]>([])
  // const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  // const [hoveringIndex, setHoveringIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [readyToDrawSwatches, setReadyToDrawSwatches] = useState(false)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 1,
    height: 1,
  })

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
      setReadyToDrawSwatches(true)
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
          ref={canvasContainerRef}
          // {...bind()}
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
          {palette &&
            palette.map((swatch, index) => (
              <DraggableSwatch
                ref={setDraggableSwatchRef(index)}
                isActive={activeIndex === index}
                key={index}
                index={index}
                startingPosition={swatch.percentLocation}
                handleMouseEnterCallback={setActiveIndex}
                handleMouseLeaveCallback={setActiveIndex}
                canvasContainerRef={canvasContainerRef}
                canvasRef={canvasRef}
                readyToDrawSwatches={readyToDrawSwatches}
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
        {palette &&
          palette.map((_, index) => (
            <ReadonlySwatch
              key={index}
              ref={setReadonlySwatchRef(index)}
              index={index}
              swatch={palette[index]}
              isActive={activeIndex === index}
              handleMouseEnterCallback={setActiveIndex}
              handleMouseLeaveCallback={setActiveIndex}
            />
          ))}
      </Box>
    </>
  )
}

export default CanvasAndPalette
