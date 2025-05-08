'use client'

import { useMediaQuery } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import _ from 'lodash'
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

export const BORDER_RADIUS = {
  ZERO: {
    PX: '0px',
    INT: 0,
  },
}

export const FONT_SIZES = {
  SMALL: {
    PX: '12px',
    INT: 12,
  },
  MEDIUM: {
    PX: '16px',
    INT: 16,
  },
  LARGE: {
    PX: '24px',
    INT: 24,
  },
  HUGE: {
    PX: '32px',
    INT: 32,
  },
  HUGE_PLUS: {
    PX: '48px',
    INT: 48,
  },
}

export const SPACING = {
  TINY: {
    PX: '4px',
    INT: 4,
  },
  SMALL: {
    PX: '10px',
    INT: 10,
  },
  MEDIUM: {
    PX: '20px',
    INT: 20,
  },
  LARGE: {
    PX: '36px',
    INT: 36,
  },
  HUGE: {
    PX: '48px',
    INT: 48,
  },
} as const

// Base theme options shared between light and dark
const baseThemeOptions: ThemeOptions = {
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.ZERO.PX,
        },
      },
    },
  },
  typography: {
    h1: {
      fontSize: FONT_SIZES.LARGE.PX,
      fontWeight: 900,
    },
    h2: {
      fontSize: FONT_SIZES.LARGE.PX,
      fontWeight: 900,
    },
    h3: {
      fontSize: FONT_SIZES.MEDIUM.PX,
      fontWeight: 900,
    },
    body1: {
      fontSize: FONT_SIZES.MEDIUM.PX,
    },
    body2: {
      fontSize: FONT_SIZES.SMALL.PX,
    },
  },
}

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    background: {
      default: PALETTE.grayscale[100],
      paper: PALETTE.grayscale[50],
    },
    text: {
      primary: PALETTE.grayscale[900],
      secondary: PALETTE.grayscale[800],
    },
    divider: PALETTE.grayscale[200],
  },
  typography: {
    h1: {
      color: PALETTE.grayscale[900],
      fontSize: FONT_SIZES.HUGE.PX,
    },
    h2: {
      color: PALETTE.grayscale[900],
    },
    h3: {
      color: PALETTE.grayscale[900],
    },
    body1: {
      color: PALETTE.grayscale[900],
    },
    body2: {
      color: PALETTE.grayscale[900],
      fontSize: FONT_SIZES.SMALL.PX,
    },
  },
}

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      default: PALETTE.grayscale[900],
      paper: PALETTE.grayscale[800],
    },
    text: {
      primary: PALETTE.grayscale[100],
      secondary: PALETTE.grayscale[50],
    },
    divider: PALETTE.grayscale[800],
  },
  typography: {
    h1: {
      color: PALETTE.grayscale[100],
    },
    h2: {
      color: PALETTE.grayscale[100],
    },
    h3: {
      color: PALETTE.grayscale[100],
    },
    body1: {
      color: PALETTE.grayscale[100],
    },
    body2: {
      color: PALETTE.grayscale[100],
    },
  },
}

const darkTheme = createTheme(_.merge(baseThemeOptions, darkThemeOptions))
const lightTheme = createTheme(_.merge(baseThemeOptions, lightThemeOptions))

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
