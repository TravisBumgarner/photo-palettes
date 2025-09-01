import { Box, Button, Typography } from '@mui/material'
import { useCallback } from 'react'
import { type MODAL_ID } from '../Modal.types'
import DefaultModal from './DefaultModal'
import { activeModalSignal } from '../../../signals'

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
        <Typography variant="h6">Create Anonymous Palette</Typography>
        <Typography variant="body1">
          Are you sure you want to create this palette?
          {colors.length > 0 && (
            <ul>
              {colors.map((color) => (
                <li key={color}>{color}</li>
              ))}
            </ul>
          )}
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
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            Ok!
          </Button>
        </Box>
      </Box>
    </DefaultModal>
  )
}

export default AnonPaletteCreationModal
