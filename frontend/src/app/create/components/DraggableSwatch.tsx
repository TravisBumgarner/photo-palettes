import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { SWATCH_SIZE } from './shared'
const DraggableSwatch = forwardRef<
  HTMLDivElement,
  {
    isHovering: boolean
    isDragging: boolean
  }
>(({ isHovering, isDragging }, ref) => {
  return (
    <motion.div
      ref={ref}
      whileHover={{
        scale: 3,
      }}
      whileDrag={{
        scale: 3,
      }}
      initial={{
        scale: isHovering || isDragging ? 3 : 1,
      }}
      animate={{
        scale: isHovering || isDragging ? 3 : 1,
      }}
      style={{
        // Additional styles set by parent via refs.
        position: 'absolute',
        width: `${SWATCH_SIZE}px`,
        cursor: 'none',
        height: `${SWATCH_SIZE}px`,
        borderRadius: '50%',
        border: `2px solid black`,
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
    />
  )
})

DraggableSwatch.displayName = 'DraggableSwatch'

export default DraggableSwatch
