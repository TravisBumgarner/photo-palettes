import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useCallback } from 'react'
import { MODAL_ID } from '../Modal.types'
import DefaultModal from './DefaultModal'
import { activeModalSignal } from '../../../signals'

export interface ConfirmationModalProps {
  id: typeof MODAL_ID.CONFIRMATION_MODAL
  title: string
  body: string
  confirmationCallback?: () => void
  cancelCallback?: () => void
  isConfirmDestructive?: boolean
  isCancelDestructive?: boolean
  showCancel?: boolean
}

const ConfirmationModal = ({
  title,
  body,
  confirmationCallback,
  cancelCallback,
  isCancelDestructive,
  isConfirmDestructive,
  showCancel,
}: ConfirmationModalProps) => {
  const handleCancel = useCallback(() => {
    cancelCallback?.()
    activeModalSignal.value = null
  }, [cancelCallback])

  const handleConfirm = useCallback(() => {
    confirmationCallback?.()
    activeModalSignal.value = null
  }, [confirmationCallback])

  return (
    <DefaultModal hideCloseButton>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1">{body}</Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          {showCancel && (
            <Button
              variant="outlined"
              color={isCancelDestructive ? 'error' : 'primary'}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            color={isConfirmDestructive ? 'error' : 'primary'}
            onClick={handleConfirm}
          >
            Ok!
          </Button>
        </Box>
      </Box>
    </DefaultModal>
  )
}

export default ConfirmationModal
