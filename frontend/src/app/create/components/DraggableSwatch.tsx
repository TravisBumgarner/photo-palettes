import { motion } from 'framer-motion'
import { TGeneratedPalette } from '../../../types'
import { getContrastColor } from '../../../utils'

const DraggableSwatch = ({
  swatch,
  isHovering,
  isDragging,
}: {
  swatch: TGeneratedPalette[number]
  isHovering: boolean
  isDragging: boolean
}) => {
  return (
    <motion.div
      initial={{
        scale: isDragging ? 3 : 1,
      }}
      animate={{
        scale: isHovering || isDragging ? 3 : 1,
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
        border: isDragging ? 'none' : `2px solid ${getContrastColor(swatch.color)}`,
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
    />
  )
}

export default DraggableSwatch
