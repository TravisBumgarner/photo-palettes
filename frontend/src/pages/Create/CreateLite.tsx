import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { v4 as uuidv4 } from 'uuid'

import { useCallback, useState } from 'react'
import { SPACING } from '../../styles/styleConsts'
import { type TGeneratedPalette } from '../../types'
import Loading from '../../sharedComponents/Loading'
import Message from '../../sharedComponents/Message'
import CanvasAndPalette from './components/CanvasAndPalette'
import Dropzone from './components/Dropzone'
import { sharedCSS } from './components/shared'
import PageWrapper from '../../styles/shared/PageWrapper'
import { resizeImage } from '../../utils/image.ts'
import { PALETTE_SIZE } from '../../consts'
import { activeModalSignal } from '../../signals'
import { MODAL_ID } from '../../sharedComponents/Modal/Modal.types'
import { useSignals } from '@preact/signals-react/runtime'
import TextField from '@mui/material/TextField'
import { useGeneratePaletteWorker } from '../../hooks/useGeneratePaletteWorker'

type UploadStatus =
  | 'INITIAL'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'ERROR'
  | 'SUBMITTING'
  | 'SUBMITTED'

const MAX_NAME_LENGTH = 50

const Create = () => {
  useSignals()

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('INITIAL')
  const [photo, setPhoto] = useState<Blob | null>(null)
  const [paletteId, setPaletteId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [palette, setPalette] = useState<TGeneratedPalette | null>(null)
  const [paletteSortOrder, setPaletteSortOrder] = useState<number[]>([])

  const { generatePalette } = useGeneratePaletteWorker()

  const updateSwatch = useCallback((index: number, color: string) => {
    setPalette((prev) => {
      if (!prev) return prev
      const updated = [...prev]
      updated[index].color = color
      return updated
    })
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        // An error was thrown, it's handled internally by Dropzone.tsx
        return
      }
      setUploadStatus('UPLOADING')
      const photo = acceptedFiles[0]
      const resizedPhoto = await resizeImage(photo, {
        maxWidth: 1600,
        maxHeight: 1600,
      })
      setPhoto(resizedPhoto)

      const photoUrl = URL.createObjectURL(resizedPhoto)
      const response = await generatePalette(photoUrl)

      if (response.success) {
        setPalette(response.palette)
        setPaletteSortOrder(Array.from({ length: PALETTE_SIZE }, (_, i) => i))
        setPaletteId(uuidv4())

        setUploadStatus('UPLOADED')
      } else {
        setUploadStatus('ERROR')
      }
    },
    [setPalette, setPaletteId, generatePalette]
  )

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value.slice(0, MAX_NAME_LENGTH))
    },
    []
  )

  const handleClearPalette = useCallback(() => {
    setPalette(null)
    setUploadStatus('INITIAL')
    setPhoto(null)
    setName('')
  }, [setPalette])

  const handleSavePalette = useCallback(async () => {
    if (!paletteId || !palette) return
    setUploadStatus('SUBMITTING')

    const sortedPalette = paletteSortOrder.map((index) => palette[index])

    activeModalSignal.value = {
      id: MODAL_ID.ANON_PALETTE_CREATION_MODAL,
      palette: sortedPalette,
      photoUrl: URL.createObjectURL(photo!),
      paletteId,
      name,
    }
  }, [paletteId, name, palette, paletteSortOrder, photo])

  const handleTryAgain = useCallback(() => {
    setUploadStatus('INITIAL')
    setPalette(null)
    setPhoto(null)
    setName('')
  }, [setPalette, setPhoto])

  const nameLabel =
    name.length > 0 ? `Name: ${name.length} / ${MAX_NAME_LENGTH}` : 'Name'

  return (
    <PageWrapper width="full">
      {uploadStatus === 'INITIAL' && <Dropzone onDrop={onDrop} />}
      {(uploadStatus === 'UPLOADING' || uploadStatus === 'SUBMITTED') && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...sharedCSS,
          }}
        >
          <Loading />
        </Box>
      )}
      {uploadStatus === 'ERROR' && (
        <Message
          message="Error generating palette"
          color="error"
          callback={handleTryAgain}
          callbackText="Try again"
        />
      )}
      {(uploadStatus === 'UPLOADED' || uploadStatus === 'SUBMITTING') && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: SPACING.SMALL.PX,
          }}
        >
          <CanvasAndPalette
            photo={photo}
            palette={palette}
            updateSwatch={updateSwatch}
            paletteSortOrder={paletteSortOrder}
            setPaletteSortOrder={setPaletteSortOrder}
          />
          <TextField
            variant="outlined"
            fullWidth
            label={nameLabel}
            placeholder="Name your palette"
            value={name}
            onChange={handleNameChange}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="outlined" onClick={handleClearPalette}>
              Clear
            </Button>
            <Button
              disabled={!name || uploadStatus === 'SUBMITTING'}
              variant="contained"
              onClick={handleSavePalette}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}
    </PageWrapper>
  )
}

export default Create
