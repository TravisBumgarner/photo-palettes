import { motion } from 'framer-motion'
import { forwardRef, useCallback, useState } from 'react'
import { SWATCH_SIZE } from './shared'
const DraggableSwatch = forwardRef<
  HTMLDivElement,
  {
    isHovering: boolean
    isDragging: boolean
  }
>(({ isHovering, isDragging }, ref) => {
  const [isHoveringInternally, setIsHoveringInternally] = useState(false)

  const handleMouseEnter = useCallback(() => {
    setIsHoveringInternally(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHoveringInternally(false)
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{
        scale: isHovering || isHoveringInternally || isDragging ? 3 : 1,
      }}
      animate={{
        scale: isHovering || isHoveringInternally || isDragging ? 3 : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
