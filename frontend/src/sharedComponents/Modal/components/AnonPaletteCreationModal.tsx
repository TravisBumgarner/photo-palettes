import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useCallback } from 'react'
import { type MODAL_ID } from '../Modal.types'
import DefaultModal from './DefaultModal'
import { activeModalSignal } from '../../../signals'
import ColorBar from '../../ColorBar'
import downloadPalette from '../../../utils/downloadPalette'

export interface AnonPaletteCreationModalProps {
  id: typeof MODAL_ID.ANON_PALETTE_CREATION_MODAL
  colors: string[]
  photoUrl: string
  paletteId: string
}

const AnonPaletteCreationModal = ({
  colors,
  photoUrl,
  paletteId,
}: AnonPaletteCreationModalProps) => {
  const handleDownload = useCallback(async () => {
    await downloadPalette({ paletteId, photoUrl, colors })
    // activeModalSignal.value = null
  }, [photoUrl, colors, paletteId])

  const handleConfirm = useCallback(async () => {
    activeModalSignal.value = null
  }, [])

  return (
    <DefaultModal hideCloseButton>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* <Typography variant="h6">Save Your palette</Typography> */}
        <img
          style={{ width: '100%', height: 'auto' }}
          src={photoUrl}
          alt="Uploaded photo"
        />
        <ColorBar colors={colors} height={30} />
        <Typography variant="body1">
          To save and share your palette, you will need to sign up.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="outlined" onClick={handleDownload}>
            Download
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            Sign up
          </Button>
        </Box>
      </Box>
    </DefaultModal>
  )
}

export default AnonPaletteCreationModal
