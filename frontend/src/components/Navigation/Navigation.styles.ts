import type { SxProps } from '@mui/material'

import { SPACING, BORDER_RADIUS, PALETTE } from '../../styles/styleConsts'

export const WrapperSX = (theme: 'dark' | 'light'): SxProps => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor:
    theme === 'dark' ? PALETTE.grayscale[800] : PALETTE.grayscale[100],
  marginBottom: SPACING.MEDIUM.PX,
  padding: SPACING.MEDIUM.PX,
})

export const createLinkSX: SxProps = {
  fontWeight: 900,
  backgroundColor: 'text.primary',
  color: 'background.paper',
  padding: SPACING.SMALL.PX,
  borderRadius: BORDER_RADIUS.ZERO.PX,
  '&:hover': {
    backgroundColor: 'text.secondary',
  },
}
