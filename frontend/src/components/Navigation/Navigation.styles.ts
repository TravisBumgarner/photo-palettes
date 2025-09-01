import type { SxProps } from '@mui/material/styles'

import {
  SPACING,
  BORDER_RADIUS,
  subtleBackground,
  LIGHT_BUTTON_STYLES,
  DARK_BUTTON_STYLES,
} from '../../styles/styleConsts'

export const WrapperSX = (theme: 'dark' | 'light'): SxProps => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: subtleBackground(theme),
  marginBottom: SPACING.MEDIUM.PX,
  padding: SPACING.MEDIUM.PX,
})

export const createLinkSX = (theme: 'dark' | 'light'): SxProps => ({
  fontWeight: 900,
  textDecoration: 'none',
  backgroundColor:
    theme === 'dark'
      ? DARK_BUTTON_STYLES.background
      : LIGHT_BUTTON_STYLES.background,
  color: `${theme === 'dark' ? DARK_BUTTON_STYLES.color : LIGHT_BUTTON_STYLES.color} !important`, // Boo me.
  padding: SPACING.SMALL.PX,
  borderRadius: BORDER_RADIUS.ZERO.PX,
  '&:hover': {
    backgroundColor:
      theme === 'dark'
        ? DARK_BUTTON_STYLES.hoverBackground
        : LIGHT_BUTTON_STYLES.hoverBackground,
  },
})
