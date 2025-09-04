import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useCallback } from 'react'
import { type MODAL_ID } from '../Modal.types'
import DefaultModal from './DefaultModal'
import { activeModalSignal } from '../../../signals'
import ColorBar from '../../ColorBar'
import downloadPalette from '../../../utils/downloadPalette'
import { queries } from '../../../database'
import { photoUrlToBlob } from '../../../utils/image'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../consts'

export interface AnonPaletteCreationModalProps {
  id: typeof MODAL_ID.ANON_PALETTE_CREATION_MODAL
  palette: { color: string; percentLocation: [number, number] }[]
  photoUrl: string
  paletteId: string
  name: string
}

const AnonPaletteCreationModal = ({
  palette,
  photoUrl,
  paletteId,
  name,
}: AnonPaletteCreationModalProps) => {
  const colors = palette.map((swatch) => swatch.color)

  const handleDownload = useCallback(async () => {
    await downloadPalette({
      paletteId,
      photoUrl,
      colors,
    })
  }, [photoUrl, colors, paletteId])

  const navigate = useNavigate()

  const handleConfirm = useCallback(async () => {
    queries.createTemporaryPalette({
      palette,
      name,
      image: await photoUrlToBlob(photoUrl),
      tempId: paletteId,
    })
    activeModalSignal.value = null
    navigate(ROUTES.signup.href)
  }, [palette, name, photoUrl, paletteId, navigate])

  return (
    <DefaultModal hideCloseButton>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
