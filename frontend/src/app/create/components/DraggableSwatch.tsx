import { useCallback } from 'react'
import { TPalette } from '../../../types'

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
    <div
      style={{
        position: 'absolute',
        left: `${swatch.percent_location[0]}%`,
        top: `${swatch.percent_location[1]}%`,
        transform: 'translate(-50%, -50%)',
        width: '15px',
        height: '15px',
        borderRadius: '50%',
        backgroundColor: swatch.color,
        border: isHovered ? '2px solid white' : '2px solid green',
        cursor: 'pointer',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
      onMouseDown={handleMouseDown}
    />
  )
}

export default DraggableSwatch
