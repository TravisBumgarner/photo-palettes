import { motion } from 'framer-motion'
import { useCallback } from 'react'
import { TGeneratedPalette } from '../../../types'
import { getContrastColor } from '../../../utils'
const DraggableSwatch = ({
  swatch,
  index,
  handleSetDraggingIndex,
  isHovered,
}: {
  swatch: TGeneratedPalette[number]
  index: number
  handleSetDraggingIndex: (index: number) => void
  isHovered: boolean
}) => {
  const handleMouseDown = useCallback(() => {
    handleSetDraggingIndex(index)
  }, [handleSetDraggingIndex, index])

  return (
    <motion.div
      initial={{
        scale: 0,
      }}
      animate={{
        scale: isHovered ? 3 : 1,
      }}
      style={{
        position: 'absolute',
        left: `${swatch.percentLocation[0]}%`,
        top: `${swatch.percentLocation[1]}%`,
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
