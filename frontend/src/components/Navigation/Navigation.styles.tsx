import type { SxProps } from '@mui/material'

import { SPACING, BORDER_RADIUS } from '../../styles/styleConsts'

export const WrapperSX: SxProps = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingBottom: SPACING.MEDIUM.PX,
  paddingTop: SPACING.MEDIUM.PX,
  alignItems: 'center',
  borderBottom: '2px solid',
  borderBottomColor: 'divider',
  marginBottom: SPACING.MEDIUM.PX,
}

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
