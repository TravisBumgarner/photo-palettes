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
          // Background are set by refs from the parent.
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100px',
          cursor: 'pointer',
          fontSize: '20px',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      ></Box>
    )
  }
)

ReadonlySwatch.displayName = 'ReadonlySwatch'

export default ReadonlySwatch

// const ReadonlyPalette = ({
//   setHoveringIndex,
//   palette,
// }: {
//   setHoveringIndex: (index: number | null) => void
//   palette: TGeneratedPalette | null
// }) => {
//   const handleMouseEnter = useCallback(
//     (index: number) => {
//       setHoveringIndex(index)
//     },
//     [setHoveringIndex]
//   )

//   const handleMouseLeave = useCallback(() => {
//     setHoveringIndex(null)
//   }, [setHoveringIndex])

//   if (!palette) return null

//   return (

//     </Box>
//   )
// }

// export default ReadonlyPalette
