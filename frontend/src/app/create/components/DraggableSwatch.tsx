import { motion } from 'framer-motion'
import { forwardRef, useCallback, useState } from 'react'

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
        // Background and position are set by refs from the parent.
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        width: '20px',
        cursor: 'grab',
        height: '20px',
        borderRadius: '50%',
        border: `2px solid black`,
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
    />
  )
})

DraggableSwatch.displayName = 'DraggableSwatch'

export default DraggableSwatch
