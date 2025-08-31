import { Box } from '@mui/material'
import { type SxProps, useTheme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import { PALETTE } from '../styles/styleConsts'
import MuiLink from '@mui/material/Link'
import _ from 'lodash'

type Props = {
  href: string
  children: React.ReactNode
  hideUnderline?: boolean
  target?: '_blank' | '_self'
  sx?: SxProps
}

const Link = ({
  href,
  children,
  hideUnderline = false,
  target = '_self',
  sx,
}: Props) => {
  const isDark = useTheme().palette.mode === 'dark'
  const isExternal = target === '_blank' || /^https?:\/\//.test(href)

  // base styles for both link types
  const baseStyle = {
    color: isDark ? PALETTE.grayscale[200] : PALETTE.grayscale[800],
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'text-decoration 0.2s',
  }

  // hover style for underline control
  const hoverStyle = hideUnderline
    ? { textDecoration: 'none' }
    : { textDecoration: 'underline' }

  if (isExternal) {
    return (
      <MuiLink
        href={href}
        target={target}
        sx={_.merge({}, baseStyle, sx, { '&:hover': hoverStyle })}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {children}
      </MuiLink>
    )
  }

  return (
    <RouterLink to={href} style={baseStyle as React.CSSProperties}>
      <Box component="span" sx={_.merge(sx, { '&:hover': hoverStyle })}>
        {children}
      </Box>
    </RouterLink>
  )
}

export default Link
