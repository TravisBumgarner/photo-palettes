import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { useCallback } from 'react'
import { ROUTES } from '../../../consts'
import { type Update, type UpdateType } from '../../../pages/ReleaseNotes/changelog'
import { activeModalSignal } from '../../../signals'
import { SPACING } from '../../../styles/styleConsts'
import Link from '../../Link'
import { MODAL_ID } from '../Modal.consts'
import DefaultModal from './DefaultModal'

export interface WhatsNewModalProps {
  id: typeof MODAL_ID.WHATS_NEW_MODAL
  latestUpdate: Update
  onDismiss: () => void
}

const LABELS: Record<UpdateType, string> = {
  add: 'Add',
  update: 'Update',
  fix: 'Fix',
}

const WhatsNewModal = ({ latestUpdate, onDismiss }: WhatsNewModalProps) => {
  const handleDismiss = useCallback(() => {
    onDismiss()
    activeModalSignal.value = null
  }, [onDismiss])

  const flatUpdates: { type: UpdateType; text: string }[] = []
    ; (['add', 'update', 'fix'] as UpdateType[]).forEach((type: UpdateType) => {
      latestUpdate.updates[type].forEach((text: string) => {
        flatUpdates.push({ type, text })
      })
    })

  return (
    <DefaultModal>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: SPACING.SMALL.PX }}>
        <Typography variant="h6">What's New</Typography>
        <Typography variant="subtitle1">{latestUpdate.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {latestUpdate.date}
        </Typography>
        <List dense sx={{ maxHeight: '300px', overflow: 'auto' }}>
          {flatUpdates.map((item, idx) => (
            <ListItem key={item.type + item.text + idx} sx={{ py: 0.5 }}>
              <Typography variant="body2">
                {LABELS[item.type]}: {item.text}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            display: 'flex',
            gap: SPACING.SMALL.PX,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: SPACING.SMALL.PX,
          }}
        >
          <Link href={ROUTES.releaseNotes.href} onClick={handleDismiss}>
            View all release notes
          </Link>
          <Button variant="contained" color="primary" onClick={handleDismiss}>
            Got it
          </Button>
        </Box>
      </Box>
    </DefaultModal>
  )
}

export default WhatsNewModal
