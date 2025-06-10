import { motion } from 'framer-motion'
import { forwardRef, useCallback } from 'react'
import { PREVIEW_SIDE_LENGTH, SWATCH_SIZE } from './shared'
const DraggableSwatch = forwardRef<
  HTMLDivElement,
  {
    index: number
    isHovering: boolean
    isDragging: boolean
    handleMouseEnterCallback: (index: number) => void
    handleMouseLeaveCallback: (index: null) => void
    neighbors: string[]
  }
>(
  (
    {
      index,
      isHovering,
      isDragging,
      handleMouseEnterCallback,
      handleMouseLeaveCallback,
      neighbors,
    },
    ref
  ) => {
    const handleMouseEnter = useCallback(() => {
      handleMouseEnterCallback(index)
    }, [index, handleMouseEnterCallback])

    const handleMouseLeave = useCallback(() => {
      handleMouseLeaveCallback(null)
    }, [handleMouseLeaveCallback])

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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          // Additional styles set by parent via refs.
          position: 'absolute',
          width: `${SWATCH_SIZE}px`,
          cursor: 'none',
          height: `${SWATCH_SIZE}px`,
          borderRadius: '50%',
          // border: `1px solid black`,
          // overflow: 'hidden',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {(isHovering || isDragging) &&
          neighbors.map((neighbor, i) => (
            <div
              key={i}
              style={{
                width: `${SWATCH_SIZE / PREVIEW_SIDE_LENGTH}px`,
                height: `${SWATCH_SIZE / PREVIEW_SIDE_LENGTH}px`,
                backgroundColor: neighbor,
              }}
            />
          ))}
      </motion.div>
    )
  }
)

DraggableSwatch.displayName = 'DraggableSwatch'

export default DraggableSwatch
