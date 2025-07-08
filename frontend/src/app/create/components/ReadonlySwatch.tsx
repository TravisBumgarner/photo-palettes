import { Box } from '@mui/material'
import { useCallback } from 'react'
import { TSwatch } from '../../../types'
import { getContrastColor } from '../../../utils'

const ReadonlySwatch = ({
  index,
  handleMouseEnterCallback,
  handleMouseLeaveCallback,
  isActive,
  swatch,
}: {
  index: number
  swatch: TSwatch
  handleMouseEnterCallback: (index: number) => void
  handleMouseLeaveCallback: (index: null) => void
  isActive: boolean
}) => {
  const handleMouseEnter = useCallback(() => {
    handleMouseEnterCallback(index)
  }, [index, handleMouseEnterCallback])

  const handleMouseLeave = useCallback(() => {
    handleMouseLeaveCallback(null)
  }, [handleMouseLeaveCallback])

  return (
    <Box
      sx={{
        backgroundColor: swatch.color,
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        cursor: 'pointer',
        fontSize: '20px',
        fontWeight: isActive ? 900 : 100,
        color: getContrastColor(swatch.color),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {swatch.color}
    </Box>
  )
}

ReadonlySwatch.displayName = 'ReadonlySwatch'

export default ReadonlySwatch
