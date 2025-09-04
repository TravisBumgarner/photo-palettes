import Box from '@mui/material/Box'
import { type SxProps, useTheme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import { PALETTE } from '../styles/styleConsts'
import MuiLink from '@mui/material/Link'
import merge from 'lodash/merge'

type Props = {
  href: string
  children: React.ReactNode
  hideHoverUnderline?: boolean
  hideBaseUnderline?: boolean
  target?: '_blank' | '_self'
  sx?: SxProps
}

const Link = ({
  href,
  children,
  hideHoverUnderline = false,
  hideBaseUnderline = false,
  target = '_self',
  sx,
}: Props) => {
  const isDark = useTheme().palette.mode === 'dark'
  const isExternal = target === '_blank' || /^https?:\/\//.test(href)

  // base styles for both link types
  const baseStyle = {
    color: isDark ? PALETTE.grayscale[100] : PALETTE.grayscale[900],
    textDecoration: hideBaseUnderline ? 'none' : 'underline',
    cursor: 'pointer',
    transition: 'text-decoration 0.2s',
  }

  // hover style for underline control
  const hoverStyle = hideHoverUnderline
    ? {
        textDecoration: 'none',
        color: isDark ? PALETTE.grayscale[0] : PALETTE.grayscale[1000],
      }
    : {
        textDecoration: 'underline',
        color: isDark ? PALETTE.grayscale[0] : PALETTE.grayscale[1000],
      }

  if (isExternal) {
    return (
      <MuiLink
        href={href}
        target={target}
        sx={merge(baseStyle, { '&:hover': hoverStyle }, sx)}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {children}
      </MuiLink>
    )
  }

  return (
    <RouterLink to={href} style={baseStyle as React.CSSProperties}>
      <Box component="span" sx={merge({ '&:hover': hoverStyle }, sx)}>
        {children}
      </Box>
    </RouterLink>
  )
}

export default Link
