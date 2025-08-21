import { Box } from '@mui/material'
import { type SxProps, useTheme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import { PALETTE } from '../styles/styleConsts'

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

  const baseStyle = {
    color: isDark ? PALETTE.grayscale[200] : PALETTE.grayscale[800],
    textDecoration: hideUnderline ? 'none' : 'underline',
  } as const

  if (isExternal) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        style={baseStyle}
      >
        <Box
          component="span"
          sx={{ ...sx, '&:hover': { textDecoration: 'underline' } }}
        >
          {children}
        </Box>
      </a>
    )
  }

  return (
    <RouterLink to={href} style={baseStyle}>
      <Box
        component="span"
        sx={{ ...sx, '&:hover': { textDecoration: 'underline' } }}
      >
        {children}
      </Box>
    </RouterLink>
  )
}

export default Link
