import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useCallback } from 'react'
import { type MODAL_ID } from '../Modal.types'
import DefaultModal from './DefaultModal'
import { activeModalSignal } from '../../../signals'
import ColorBar from '../../ColorBar'

export interface AnonPaletteCreationModalProps {
  id: typeof MODAL_ID.ANON_PALETTE_CREATION_MODAL
  colors: string[]
}

const AnonPaletteCreationModal = ({
  colors,
}: AnonPaletteCreationModalProps) => {
  const handleCancel = useCallback(() => {
    activeModalSignal.value = null
  }, [])

  const handleConfirm = useCallback(() => {
    activeModalSignal.value = null
  }, [])

  return (
    <DefaultModal hideCloseButton>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Typography variant="h6">Save Your palette</Typography>
        <ColorBar colors={colors} height={30} />
        <Typography variant="body1">
          To save your palette, you'll need an account. Prefer not to sign up?
          No worries—you can still download it.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="outlined" onClick={handleCancel}>
            Download
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            Sign Up & Save
          </Button>
        </Box>
      </Box>
    </DefaultModal>
  )
}

export default AnonPaletteCreationModal
