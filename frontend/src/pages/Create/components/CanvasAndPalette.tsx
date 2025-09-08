import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

import { useCallback, useEffect, useRef, useState } from 'react'
import { SPACING } from '../../../styles/styleConsts'
import { type TGeneratedPalette } from '../../../types'
import DraggableSwatch from './DraggableSwatch'
import ReadonlySwatch from './ReadonlySwatch'
import { Reorder } from 'framer-motion'

const CanvasAndPalette = ({
  photo,
  palette,
  updateSwatch,
  paletteSortOrder,
  selectedPaletteIndex,
  setPaletteSortOrder,
}: {
  photo: Blob | null
  palette: TGeneratedPalette | null
  selectedPaletteIndex: number
  updateSwatch: (
    index: number,
    color: string,
    percentLocation: [number, number]
  ) => void
  paletteSortOrder: number[]
  setPaletteSortOrder: (order: number[]) => void
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [readyToDrawSwatches, setReadyToDrawSwatches] = useState(false)
  const [imageDimensions, setImageDimensions] = useState<{
    width: number
    height: number
  }>({
    width: 1,
    height: 1,
  })

  const setPhotoOnCanvas = useCallback((photo: Blob) => {
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
    if (photo) setPhotoOnCanvas(photo)
  }, [photo, setPhotoOnCanvas])

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          ref={canvasContainerRef}
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
                isActive={activeIndex === index}
                isHovered={hoverIndex === index}
                key={`${selectedPaletteIndex}-${index}`}
                index={index}
                startingPercentLocation={swatch.percentLocation}
                setActiveIndex={setActiveIndex}
                canvasContainerRef={canvasContainerRef}
                canvasRef={canvasRef}
                readyToDrawSwatches={readyToDrawSwatches}
                updateSwatch={updateSwatch}
              />
            ))}
        </div>
      </Box>
      <Tooltip title="Drag to reorder." placement="bottom">
        <Reorder.Group
          as="div"
          axis="x"
          values={paletteSortOrder}
          onReorder={setPaletteSortOrder}
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: SPACING.MEDIUM.PX,
          }}
        >
          {palette &&
            paletteSortOrder.map((index) => (
              <ReadonlySwatch
                key={index}
                index={index}
                swatch={palette[index]}
                isActive={activeIndex === index}
                isOtherActive={activeIndex !== null && activeIndex !== index}
                setHoverIndex={setHoverIndex}
              />
            ))}
        </Reorder.Group>
      </Tooltip>
    </Box>
  )
}

export default CanvasAndPalette
