import { Box, Button, TextField } from '@mui/material'
import { useCallback, useState } from 'react'
import { SPACING } from '../../styles/styleConsts'
import { type TGeneratedPalette } from '../../types'
import Loading from '../../sharedComponents/Loading'
import Message from '../../sharedComponents/Message'
import CanvasAndPalette from './components/CanvasAndPalette'
import Dropzone from './components/Dropzone'
import { sharedCSS } from './components/shared'
import PageWrapper from '../../styles/shared/PageWrapper'
import { resizeImage } from '../../utils/resizeImage'
import PageTitle from '../../styles/shared/PageTitle'
import kmeans from './kmeans'
import { PALETTE_SIZE } from '../../consts'

type UploadStatus =
  | 'INITIAL'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'ERROR'
  | 'SUBMITTING'
  | 'SUBMITTED'

const MAX_NAME_LENGTH = 50

const Create = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('INITIAL')
  const [photo, setPhoto] = useState<Blob | null>(null)
  const [paletteId, setPaletteId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [palette, setPalette] = useState<TGeneratedPalette | null>(null)
  const [paletteSortOrder, setPaletteSortOrder] = useState<number[]>([])

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
      const resizedPhoto = await resizeImage(photo)
      setPhoto(resizedPhoto)

      const response = await kmeans(resizedPhoto)
      if (response.success) {
        setPalette(response.palette)
        setPaletteSortOrder(Array.from({ length: PALETTE_SIZE }, (_, i) => i))
        setPaletteId(response.paletteId)
        setUploadStatus('UPLOADED')
      } else {
        setUploadStatus('ERROR')
      }
    },
    [setPalette, setPaletteId]
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

  const whatToDoWithPalette = ({
    palette,
    paletteId,
    name,
  }: {
    palette: TGeneratedPalette | null
    paletteId: string | null
    name: string
  }) => {
    if (!palette || !paletteId || !name) return

    alert('Nice palette')

    return {}
  }

  const handleSavePalette = useCallback(async () => {
    if (!paletteId || !palette) return
    setUploadStatus('SUBMITTING')

    const sortedPalette = paletteSortOrder.map((index) => palette[index])
    await whatToDoWithPalette({
      palette: sortedPalette,
      paletteId,
      name,
    })
  }, [paletteId, name, palette, paletteSortOrder])

  const handleTryAgain = useCallback(() => {
    setUploadStatus('INITIAL')
    setPalette(null)
    setPhoto(null)
  }, [setPalette, setPhoto])

  const nameLabel =
    name.length > 0 ? `Name: ${name.length} / ${MAX_NAME_LENGTH}` : 'Name'

  return (
    <PageWrapper width="full">
      <PageTitle marginBottom text="Create Lite" />
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
