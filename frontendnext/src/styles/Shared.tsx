'use client'

import { Box, SxProps, Typography } from '@mui/material'
import { SPACING } from './styleConsts'
import React, { useMemo } from 'react'

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
/**
 *
 * @param width - `small | medium | full` - Specify how much horizontal screen space to take up and center if less than full.
 * @param minHeight - `boolean` - For pages with not lots of content, set a min height.
 * @param verticallyAlign - `boolean` - Used with minHeight to align content.
 * @param staticContent - `boolean` - For pages that are purely static content to add some styling to text, titles, lists, etc.
 * @returns
 */
export const PageWrapper = ({
  children,
  width,
  minHeight,
  verticallyAlign,
  staticContent,
  sx,
}: {
  children: React.ReactNode
  width: 'small' | 'medium' | 'full'
  minHeight?: boolean
  verticallyAlign?: boolean
  staticContent?: boolean
  sx?: SxProps
}) => {
  const widthCSS = useMemo((): React.CSSProperties => {
    if (width === 'small') {
      return {
        width: '400px',
        maxWidth: '95%',
        margin: '0 auto',
      }
    }

    if (width === 'medium') {
      return {
        width: '600px',
        maxWidth: '95%',
        margin: '0 auto',
      }
    }

    return {}
  }, [width])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ...widthCSS,
        ...(minHeight
          ? {
              minHeight: '70vh',
            }
          : {}),
        ...(verticallyAlign
          ? {
              justifyContent: 'center',
            }
          : {}),
        ...(staticContent
          ? {
              gap: SPACING.MEDIUM.PX,
              boxSizing: 'border-box',
              ul: {
                marginLeft: SPACING.LARGE.PX,
              },
            }
          : {}),
        ...(sx ? sx : {}),
      }}
    >
      {children}
    </Box>
  )
}

export const authFormCSS: React.CSSProperties = {
  display: 'flex',
  gap: SPACING.MEDIUM.PX,
  flexDirection: 'column',
}

export const PageTitle = ({
  text,
  marginBottom,
  center,
  sx,
}: {
  text: string
  marginBottom?: boolean
  center?: boolean
  sx?: SxProps
}) => {
  return (
    <Typography
      variant="h2"
      sx={{
        marginBottom: marginBottom ? SPACING.MEDIUM.PX : '0px',
        textAlign: center ? 'center' : 'left',
        ...(sx ? sx : {}),
      }}
    >
      {text}
    </Typography>
  )
}
