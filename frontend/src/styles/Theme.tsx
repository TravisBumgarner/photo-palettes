import { useMediaQuery } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import {
  createTheme,
  type ThemeOptions,
  ThemeProvider,
} from '@mui/material/styles'
import _ from 'lodash'
import { useMemo } from 'react'
import { FONT_SIZES, PALETTE, BORDER_RADIUS } from './styleConsts'

// Base theme options shared between light and dark
const baseThemeOptions: ThemeOptions = {
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 0,
        },
      },
    },
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
          textTransform: 'none',
          borderRadius: BORDER_RADIUS.ZERO.PX,
          boxShadow: 'none',
          cursor: 'pointer',
          fontWeight: 600,
          '&:hover': {
            boxShadow: 'none',
          },
          '&:disabled': {
            cursor: 'not-allowed',
          },
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
    fontFamily: '"Satoshi", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: FONT_SIZES.HUGE.PX,
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
    info: {
      main: PALETTE.grayscale[700],
      contrastText: PALETTE.grayscale[200],
    },
    error: {
      main: PALETTE.grayscale[700],
      contrastText: PALETTE.grayscale[200],
    },
    background: {
      default: PALETTE.grayscale[50],
      paper: PALETTE.grayscale[50],
    },
    text: {
      primary: PALETTE.grayscale[900],
      secondary: PALETTE.grayscale[800],
    },
    divider: PALETTE.grayscale[300],
  },
  typography: {
    h1: {
      color: PALETTE.grayscale[900],
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
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: PALETTE.grayscale[100],
          backgroundColor: PALETTE.grayscale[700],
          '&:hover': {
            backgroundColor: PALETTE.grayscale[600],
          },
          '&:disabled': {
            backgroundColor: PALETTE.grayscale[400],
          },
        },
        outlinedPrimary: {
          color: PALETTE.grayscale[800],
          borderColor: PALETTE.grayscale[600],
          '&:hover': {
            backgroundColor: PALETTE.grayscale[300],
          },
          '&:disabled': {
            textColor: PALETTE.grayscale[400],
          },
        },
        textPrimary: {
          color: 'pink', // For now I don't think I'm using this anywhere.
          '&:hover': {
            backgroundColor: 'lightpink',
          },
          '&:disabled': {
            textColor: 'lightpink',
          },
        },
      },
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
    info: {
      main: PALETTE.grayscale[200],
      contrastText: PALETTE.grayscale[800],
    },
    error: {
      main: PALETTE.grayscale[200],
      contrastText: PALETTE.grayscale[800],
    },
    text: {
      primary: PALETTE.grayscale[100],
      secondary: PALETTE.grayscale[50],
    },
    divider: PALETTE.grayscale[700],
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
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: PALETTE.grayscale[800],
          backgroundColor: PALETTE.grayscale[200],
          '&:hover': {
            backgroundColor: PALETTE.grayscale[300],
          },
          '&:disabled': {
            backgroundColor: PALETTE.grayscale[700],
          },
        },
        outlinedPrimary: {
          color: PALETTE.grayscale[100],
          borderColor: PALETTE.grayscale[200],
          '&:hover': {
            backgroundColor: PALETTE.grayscale[700],
          },
          '&:disabled': {
            textColor: PALETTE.grayscale[600],
          },
        },
        textPrimary: {
          color: 'pink', // For now I don't think I'm using this anywhere.
          '&:hover': {
            backgroundColor: 'lightpink',
          },
          '&:disabled': {
            textColor: 'lightpink',
          },
        },
      },
    },
  },
}

const darkTheme = createTheme(_.merge(baseThemeOptions, darkThemeOptions))
const lightTheme = createTheme(_.merge(baseThemeOptions, lightThemeOptions))

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(
    () => (prefersDarkMode ? darkTheme : lightTheme),
    [prefersDarkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default AppThemeProvider
