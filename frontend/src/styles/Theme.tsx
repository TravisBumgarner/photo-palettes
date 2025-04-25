'use client'

import { useMediaQuery } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import { useMemo } from 'react'

// Base theme options shared between light and dark
const baseThemeOptions: ThemeOptions = {
  typography: {
    body1: {
      fontSize: '24px',
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
