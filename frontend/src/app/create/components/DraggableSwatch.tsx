import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { TGeneratedPalette } from '../../../types'
import { getContrastColor } from '../../../utils'

const DraggableSwatch = forwardRef<
  HTMLDivElement,
  {
    swatch: TGeneratedPalette[number]
    isHovering: boolean
    isDragging: boolean
  }
>(({ swatch, isHovering, isDragging }, ref) => {
  return (
    <motion.div
      ref={ref}
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
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: swatch.color,
        border: isDragging ? 'none' : `2px solid ${getContrastColor(swatch.color)}`,
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
    />
  )
})

DraggableSwatch.displayName = 'DraggableSwatch'

export default DraggableSwatch
