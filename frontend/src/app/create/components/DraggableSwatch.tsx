import { motion } from 'framer-motion'
import { forwardRef } from 'react'

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
      initial={{
        scale: isHovering || isDragging ? 3 : 1,
      }}
      animate={{
        scale: isHovering || isDragging ? 3 : 1,
      }}
      style={{
        // Background and position are set by refs from the parent.
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: isDragging ? 'none' : `2px solid black`,
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
    />
  )
})

DraggableSwatch.displayName = 'DraggableSwatch'

export default DraggableSwatch
