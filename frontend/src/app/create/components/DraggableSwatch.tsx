import { Box } from '@mui/material'
import { useCallback } from 'react'
import { PALETTE } from '../../../styles/Theme'
import { TPalette } from '../../../types'
import { getContrastColor } from '../../../utils'

const DraggableSwatch = ({
  swatch,
  index,
  handleSetDraggingIndex,
  isHovered,
}: {
  swatch: TPalette[number]
  index: number
  handleSetDraggingIndex: (index: number) => void
  isHovered: boolean
}) => {
  const handleMouseDown = useCallback(() => {
    handleSetDraggingIndex(index)
  }, [handleSetDraggingIndex, index])

  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${swatch.percent_location[0]}%`,
        top: `${swatch.percent_location[1]}%`,
        transform: 'translate(-50%, -50%)',
        width: '15px',
        height: '15px',
        borderRadius: '50%',
        backgroundColor: swatch.color,
        border: isHovered
          ? `2px solid ${PALETTE.primary[500]}`
          : `2px solid ${getContrastColor(swatch.color)}`,
        cursor: 'pointer',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
      onMouseDown={handleMouseDown}
    />
  )
}

export default DraggableSwatch
