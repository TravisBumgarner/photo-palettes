import { Box } from '@mui/material'
import { forwardRef, useCallback } from 'react'

const ReadonlySwatch = forwardRef(
  (
    {
      index,
      handleMouseEnterCallback,
      handleMouseLeaveCallback,
    }: {
      index: number
      handleMouseEnterCallback: (index: number) => void
      handleMouseLeaveCallback: (index: null) => void
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
          // Additional styles set by parent via refs.
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          cursor: 'pointer',
          fontSize: '20px',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Set by parent via refs. */}
      </Box>
    )
  }
)

ReadonlySwatch.displayName = 'ReadonlySwatch'

export default ReadonlySwatch
