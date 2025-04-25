import { Box } from '@mui/material'
import { useCallback } from 'react'
import { TPalette } from '../../../types'
import { getContrastColor } from '../../../utils'

const DraggableSwatch = ({
  swatch,
  index,
  handleSetDraggingIndex,
}: {
  swatch: TPalette[number]
  index: number
  handleSetDraggingIndex: (index: number) => void
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
        border: `2px solid ${getContrastColor(swatch.color)}`,
        cursor: 'pointer',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
      onMouseDown={handleMouseDown}
    />
  )
}

export default DraggableSwatch
