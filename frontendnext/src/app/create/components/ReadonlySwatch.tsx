import { useCallback } from 'react'
import { TSwatch } from '../../../types'
import { getContrastColor } from '../../../utils'
import { motion } from 'framer-motion'

const ReadonlySwatch = ({
  index,
  setActiveIndex,
  isActive,
  isOtherActive,
  swatch,
}: {
  index: number
  swatch: TSwatch
  setActiveIndex: (index: number | null) => void
  isActive: boolean
  isOtherActive: boolean
}) => {
  const handleOnClick = useCallback(() => {
    setActiveIndex(isActive ? null : index)
  }, [index, setActiveIndex, isActive])

  return (
    <motion.div
      initial={{ flexGrow: 1, flexBasis: '16.66%', scale: 1 }}
      animate={{
        flexGrow: isActive ? 1 : isOtherActive ? 0 : 1,
        flexBasis: isActive ? '16.66%' : isOtherActive ? '0%' : '16.66%',
        scale: isOtherActive && !isActive ? 0 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        backgroundColor: swatch.color,
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: isActive ? 900 : 100,
        color: getContrastColor(swatch.color),
        zIndex: isActive ? 2 : 1,
        boxSizing: 'border-box',
      }}
      onClick={handleOnClick}
    >
      {swatch.color}
    </motion.div>
  )
}

ReadonlySwatch.displayName = 'ReadonlySwatch'

export default ReadonlySwatch
