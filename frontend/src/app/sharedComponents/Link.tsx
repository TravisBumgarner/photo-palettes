import { Box } from '@mui/material'
import { SxProps, useTheme } from '@mui/material/styles'
import NextLink from 'next/link'
import { PALETTE } from '../../styles/Theme'

const Link = ({
  href,
  children,
  hideUnderline = false,
  target = '_self',
  sx,
}: {
  href: string
  children: React.ReactNode
  hideUnderline?: boolean
  target?: '_blank' | '_self'
  sx?: SxProps
}) => {
  const isDarkTheme = useTheme().palette.mode === 'dark'

  return (
    <NextLink
      target={target}
      style={{
        color: isDarkTheme ? PALETTE.grayscale[400] : PALETTE.grayscale[800],
        textDecoration: hideUnderline ? 'none' : 'underline',
      }}
      href={href}
    >
      <Box
        component="span"
        sx={{
          ...sx,
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        {children}
      </Box>
    </NextLink>
  )
}

export default Link
