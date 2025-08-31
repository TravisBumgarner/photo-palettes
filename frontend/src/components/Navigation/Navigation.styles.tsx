import type { SxProps } from '@mui/material'

import { SPACING } from '../../styles/styleConsts'

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
