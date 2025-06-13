import { motion } from 'framer-motion'
import { forwardRef, useCallback } from 'react'
import { BORDER_WIDTH, PIXEL_SIDE_LENGTH } from './shared'

const SIDE_LENGTH = PIXEL_SIDE_LENGTH * 3 + BORDER_WIDTH * 2
const SIDE_LENGTH_SCALED = SIDE_LENGTH * 3

const ACTIVE_STYLES = {
  width: `${SIDE_LENGTH_SCALED}px`,
  height: `${SIDE_LENGTH_SCALED}px`,
}

const INACTIVE_STYLES = {
  width: `${SIDE_LENGTH}px`,
  height: `${SIDE_LENGTH}px`,
}

const DraggableSwatch = forwardRef<
  HTMLDivElement,
  {
    index: number
    isActive: boolean
    handleMouseEnterCallback: (index: number) => void
    handleMouseLeaveCallback: (index: null) => void
    neighbors: string[]
  }
>(({ index, isActive, handleMouseEnterCallback, handleMouseLeaveCallback, neighbors }, ref) => {
  const handleMouseEnter = useCallback(() => {
    handleMouseEnterCallback(index)
  }, [index, handleMouseEnterCallback])

  const handleMouseLeave = useCallback(() => {
    handleMouseLeaveCallback(null)
  }, [handleMouseLeaveCallback])

  return (
    <motion.div
      ref={ref}
      whileHover={ACTIVE_STYLES}
      whileDrag={ACTIVE_STYLES}
      initial={{
        ...INACTIVE_STYLES,
        x: '-50%',
        y: '-50%',
      }}
      animate={isActive ? ACTIVE_STYLES : INACTIVE_STYLES}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        // Additional styles set by parent via refs.
        position: 'absolute',
        cursor: 'none',
        border: `2px solid black`,
        overflow: 'hidden',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
      }}
    >
      {isActive &&
        neighbors.map((neighbor, i) => (
          <div
            key={i}
            style={{
              border: `0.5px solid color-mix(in srgb, ${neighbor} 90%, white 10%)`,
              backgroundColor: neighbor,
            }}
          />
        ))}
    </motion.div>
  )
})

DraggableSwatch.displayName = 'DraggableSwatch'

export default DraggableSwatch
