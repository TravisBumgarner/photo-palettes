'use client'

import { Box } from '@mui/material'
import { SPACING } from './Theme'

const StaticContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.MEDIUM.PX,
        width: '100%',
        maxWidth: '800px',
        margin: '0px auto',
        boxSizing: 'border-box',
        '& .MuiListItem-root': {
          display: 'list-item',
          listStyleType: 'circle',
        },
        '& > ul': {
          marginLeft: SPACING.LARGE.PX,
        },
      }}
    >
      {children}
    </Box>
  )
}

export default StaticContentWrapper
