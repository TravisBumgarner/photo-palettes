import { Box } from '@mui/material'
import { forwardRef, useCallback } from 'react'
import { TSwatch } from '../../../types'

const ReadonlySwatch = forwardRef(
  (
    {
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
      <Box
        ref={ref}
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
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {swatch.color}
      </Box>
    )
  }
)

ReadonlySwatch.displayName = 'ReadonlySwatch'

export default ReadonlySwatch
