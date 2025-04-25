'use client'

import { useMediaQuery } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import { useMemo } from 'react'

export const PALETTE = {
  grayscale: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  primary: {
    50: '#e7ffff',
    100: '#c2ffff',
    200: '#99ffff',
    300: '#66ffff',
    400: '#33ffff',
    500: '#00ffff',
    600: '#00e1e1',
    700: '#00c2c2',
    800: '#00a3a3',
    900: '#008484',
  },
  secondary: {
    50: '#fff2fd',
    100: '#ffd1fc',
    200: '#ffb3fa',
    300: '#ff94f8',
    400: '#ff76f6',
    500: '#ff58f4',
    600: '#e638d9',
    700: '#cc19b3',
    800: '#b3008c',
    900: '#990066',
  },
}

// Base theme options shared between light and dark
const baseThemeOptions: ThemeOptions = {
  typography: {
    body1: {
      fontSize: '24px',
    },
    h1: {
      fontSize: '48px',
    },
    h2: {
      fontSize: '36px',
    },
    h3: {
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
      default: PALETTE.grayscale[50],
      paper: PALETTE.grayscale[50],
    },
    text: {
      primary: PALETTE.grayscale[900],
      secondary: PALETTE.grayscale[900],
    },
  },
})

// Dark theme
const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    background: {
      default: PALETTE.grayscale[900],
      paper: PALETTE.grayscale[900],
    },
    text: {
      primary: PALETTE.grayscale[50],
      secondary: PALETTE.grayscale[50],
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
