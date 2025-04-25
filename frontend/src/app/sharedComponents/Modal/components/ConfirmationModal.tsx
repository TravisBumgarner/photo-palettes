import { Box, Button, Typography } from '@mui/material'
import { useCallback } from 'react'
import useGlobalStore from '../../../../store'
import { type ModalID } from '../Modal.consts'
import DefaultModal from './DefaultModal'

export interface ConfirmationModalProps {
  id: ModalID
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
  const { setActiveModal } = useGlobalStore()

  const handleCancel = useCallback(() => {
    cancelCallback?.()
    setActiveModal(null)
  }, [cancelCallback, setActiveModal])

  const handleConfirm = useCallback(() => {
    confirmationCallback?.()
    setActiveModal(null)
  }, [confirmationCallback, setActiveModal])

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
            Ok
          </Button>
        </Box>
      </Box>
    </DefaultModal>
  )
}

export default ConfirmationModal
