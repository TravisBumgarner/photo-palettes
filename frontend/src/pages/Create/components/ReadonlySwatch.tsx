import { Reorder } from 'framer-motion'
import { FONT_SIZES } from '../../../styles/styleConsts'
import { type TGeneratedSwatch } from '../../../types'
import { getContrastColor } from '../../../utils/getContrastColor'

const ReadonlySwatch = ({
  index,
  isActive,
  isOtherActive,
  swatch,
  setHoverIndex,
}: {
  index: number
  swatch: TGeneratedSwatch
  setHoverIndex: (index: number | null) => void
  isActive: boolean
  isOtherActive: boolean
}) => {
  return (
    <Reorder.Item
      onMouseEnter={() => {
        setHoverIndex(index)
      }}
      onMouseLeave={() => {
        setHoverIndex(null)
      }}
      as="div"
      key={index}
      value={index}
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
        fontWeight: isActive ? 900 : 500,
        fontSize: isActive ? FONT_SIZES.MEDIUM.PX : FONT_SIZES.SMALL.PX,
        color: getContrastColor(swatch.color),
        zIndex: isActive ? 2 : 1,
        boxSizing: 'border-box',
      }}
    >
      {isActive ? swatch.color : null}
    </Reorder.Item>
  )
}

ReadonlySwatch.displayName = 'ReadonlySwatch'

export default ReadonlySwatch
