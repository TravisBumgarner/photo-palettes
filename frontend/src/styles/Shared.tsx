'use client'

import { Box } from '@mui/material'
import { SPACING } from './Theme'

export const StaticContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.MEDIUM.PX,
        width: '100%',
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

export const ThumbnailGridDisplay = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: SPACING.MEDIUM.PX,
        '@media (max-width: 768px)': {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
        '@media (max-width: 480px)': {
          gridTemplateColumns: 'repeat(1, 1fr)',
        },
      }}
    >
      {children}
    </Box>
  )
}
