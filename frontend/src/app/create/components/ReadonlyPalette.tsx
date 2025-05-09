import { Box } from '@mui/material'
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
    <Box
      key={swatch.color}
      sx={{
        height: '50px',
        backgroundColor: swatch.color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '12px',
        width: '100px',
        cursor: 'pointer',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span style={{ color: getContrastColor(swatch.color), fontSize: '20px' }}>
        {swatch.color}
      </span>
    </Box>
  )
}

const ReadonlyPalette = ({
  setHoveringIndex,
  palette,
}: {
  setHoveringIndex: (index: number | null) => void
  palette: TGeneratedPalette | null
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

  if (!palette) return null

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        margin: '0 auto',
        '@media (max-width: 700px)': {
          width: '300px',
          flexWrap: 'wrap',
        },
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
    </Box>
  )
}

export default ReadonlyPalette
