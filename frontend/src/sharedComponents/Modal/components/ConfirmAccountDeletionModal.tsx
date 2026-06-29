import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation } from '@tanstack/react-query'
import posthog from 'posthog-js'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteMe } from '../../../api/user/deleteMe'
import config from '../../../config'
import { trackEvent } from '../../../services/analytics'
import { logout } from '../../../services/supabase'
import { activeModalSignal } from '../../../signals'
import useGlobalStore from '../../../store'
import Message from '../../Message'
import { MODAL_ID } from '../Modal.consts'
import DefaultModal from './DefaultModal'

const DELETE_CONFIRMATION_TEXT = 'DELETE'

export interface ConfirmAccountDeletionModalProps {
  id: typeof MODAL_ID.CONFIRM_ACCOUNT_DELETION_MODAL
}

const ConfirmAccountDeletionModal = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [confirmationText, setConfirmationText] = useState('')
  const navigate = useNavigate()
  const setAppUser = useGlobalStore((state) => state.setAppUser)
  const setAuthUser = useGlobalStore((state) => state.setAuthUser)

  const { mutate } = useMutation({
    mutationKey: ['deleteAccount'],
    mutationFn: deleteMe,
    retry: false,
    onSuccess: async (data) => {
      if (data.success) {
        logout()
        setAuthUser(null)
        setAppUser(null)
        if (config.isProduction) {
          posthog.reset()
        }
        activeModalSignal.value = null
        navigate('/')
      } else {
        setErrorMessage(data.message)
      }
    },
    onError: () => {
      setErrorMessage('An unknown error occurred. Please try again later.')
    },
  })

  const handleCancel = useCallback(() => {
    activeModalSignal.value = null
  }, [])

  const handleConfirm = useCallback(() => {
    trackEvent({
      event: 'confirm_account_deletion',
    })
    mutate()
  }, [mutate])

  return (
    <DefaultModal>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Typography variant="h6">Delete Account</Typography>
        {errorMessage && <Message color="error" message={errorMessage} />}
        <Typography variant="body1">
          Are you sure you want to delete your account and all of its data?
          <br />
          THIS CANNOT BE UNDONE.
        </Typography>
        <TextField
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          label={`Type "${DELETE_CONFIRMATION_TEXT}" to confirm`}
          variant="outlined"
        />
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="outlined" color="primary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={confirmationText !== DELETE_CONFIRMATION_TEXT}
            variant="contained"
            color="primary"
            onClick={handleConfirm}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </DefaultModal>
  )
}

export default ConfirmAccountDeletionModal
