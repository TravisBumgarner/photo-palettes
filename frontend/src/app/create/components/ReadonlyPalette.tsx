import { useCallback } from 'react'
import { TGeneratedPalette } from '../../../types'
import { getContrastColor } from '../../../utils'

const ReadonlySwatch = ({
  swatch,
  index,
  handleMouseEnterCallback,
  handleMouseLeaveCallback,
}: {
  swatch: TGeneratedPalette[number]
  index: number
  handleMouseEnterCallback: (index: number) => void
  handleMouseLeaveCallback: () => void
}) => {
  const handleMouseEnter = useCallback(() => {
    handleMouseEnterCallback(index)
  }, [index, handleMouseEnterCallback])

  const handleMouseLeave = useCallback(() => {
    handleMouseLeaveCallback()
  }, [handleMouseLeaveCallback])

  return (
    <div
      key={swatch.color}
      style={{
        flexGrow: 1,
        height: '50px',
        backgroundColor: swatch.color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '12px',
        width: '150px',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span style={{ color: getContrastColor(swatch.color), fontSize: '20px' }}>
        {swatch.color}
      </span>
    </div>
  )
}
const ReadonlyPalette = ({
  palette,
  setHoveringIndex,
}: {
  palette: TGeneratedPalette
  setHoveringIndex: (index: number | null) => void
}) => {
  const handleMouseEnter = useCallback(
    (index: number) => {
      setHoveringIndex(index)
    },
    [setHoveringIndex]
  )

  const handleMouseLeave = useCallback(() => {
    setHoveringIndex(null)
  }, [setHoveringIndex])

  return (
    palette.length > 0 && (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '450px',
          margin: '0 auto',
        }}
      >
        {palette.map((swatch, index) => (
          <ReadonlySwatch
            key={`${swatch.color}-${index}`}
            swatch={swatch}
            index={index}
            handleMouseEnterCallback={handleMouseEnter}
            handleMouseLeaveCallback={handleMouseLeave}
          />
        ))}
      </div>
    )
  )
}

export default ReadonlyPalette
