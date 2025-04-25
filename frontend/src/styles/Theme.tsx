'use client'

import { useMediaQuery } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import { useMemo } from 'react'

// Base theme options shared between light and dark
const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Satoshi", Arial, Helvetica, sans-serif',
    body1: {
      fontSize: '24px',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': {
          fontFamily: 'Satoshi',
          src: "url('/fonts/Satoshi-Variable.woff2') format('woff2'), url('/fonts/Satoshi-Variable.woff') format('woff'), url('/fonts/Satoshi-Variable.ttf') format('ttf')",
          fontWeight: 400,
          fontStyle: 'normal',
          fontDisplay: 'swap',
        },
        'html, body': {
          maxWidth: '100vw',
          padding: '20px',
          overflowX: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        a: {
          textDecoration: 'none',
          color: '#bd4e85',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
}

// Light theme
const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#171717',
      secondary: '#171717',
    },
  },
})

// Dark theme
const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0a0a',
      paper: '#0a0a0a',
    },
    text: {
      primary: '#ededed',
      secondary: '#ededed',
    },
  },
})

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(() => (prefersDarkMode ? darkTheme : lightTheme), [prefersDarkMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default AppThemeProvider
