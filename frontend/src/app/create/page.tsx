'use client'

import { Box, Button, TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { createPalette } from '../../api/palettes/createPalette'
import { generatePalette } from '../../api/palettes/generatePalette'
import { logger } from '../../services/logging'
import useGlobalStore from '../../store'
import { SPACING } from '../../styles/Theme'
import { TGeneratedPalette } from '../../types'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import { ModalID } from '../sharedComponents/Modal/Modal.consts'
import CanvasAndPalette from './components/CanvasAndPalette'
import Dropzone from './components/Dropzone'

enum UploadStatus {
  INITIAL = 'INITIAL',
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  ERROR = 'ERROR',
  SUBMITTING = 'SUBMITTING',
  SUBMITTED = 'SUBMITTED',
}

const Create = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.INITIAL)
  const [photo, setPhoto] = useState<File | null>(null)
  const router = useRouter()
  const [paletteId, setPaletteId] = useState<string | null>(null)
  const setActiveModal = useGlobalStore(state => state.setActiveModal)
  const [name, setName] = useState('')
  const [palette, setPalette] = useState<TGeneratedPalette | null>(null)

  const generatePaletteMutation = useMutation({
    mutationFn: generatePalette,
    onSuccess: () => {
      setUploadStatus(UploadStatus.UPLOADED)
    },
    onError: () => {
      logger.error('Error generating palette')
      setUploadStatus(UploadStatus.ERROR)
    },
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploadStatus(UploadStatus.UPLOADING)
      const photo = acceptedFiles[0]
      setPhoto(photo)
      const response = await generatePaletteMutation.mutateAsync(photo)
      if (response.success) {
        setPalette(response.palette)
        setPaletteId(response.paletteId)
        setUploadStatus(UploadStatus.UPLOADED)
      } else {
        setUploadStatus(UploadStatus.ERROR)
      }
    },
    [generatePaletteMutation, setPalette, setPaletteId]
  )

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }, [])

  const handleClearPalette = useCallback(() => {
    setPalette(null)
    setUploadStatus(UploadStatus.INITIAL)
    setPhoto(null)
    setName('')
  }, [setPalette])

  const createPaletteMutation = useMutation({
    mutationFn: createPalette,
    onSuccess: () => {
      setUploadStatus(UploadStatus.UPLOADED)
    },
    onError: () => {
      logger.error('Error saving palette')
      setUploadStatus(UploadStatus.ERROR)
    },
  })

  const handleSavePalette = useCallback(async () => {
    if (!paletteId || !palette) return
    setUploadStatus(UploadStatus.SUBMITTING)

    const response = await createPaletteMutation.mutateAsync({
      palette,
      paletteId,
      name,
    })

    if (response.success) {
      setActiveModal({
        id: ModalID.ConfirmationModal,
        confirmationCallback: () => {
          router.push(`/palette/${paletteId}`)
        },
        title: 'Thanks for your submission!',
        body: 'Once it is approved, it will be added to the site.',
      })
      setUploadStatus(UploadStatus.SUBMITTED)
    } else {
      setUploadStatus(UploadStatus.ERROR)
    }
  }, [paletteId, createPaletteMutation, setActiveModal, router, name, palette])

  const handleTryAgain = useCallback(() => {
    setUploadStatus(UploadStatus.INITIAL)
    setPalette(null)
    setPhoto(null)
  }, [setPalette, setPhoto])
  return (
    <Box>
      {uploadStatus === UploadStatus.INITIAL && <Dropzone onDrop={onDrop} />}
      {(uploadStatus === UploadStatus.UPLOADING || uploadStatus === UploadStatus.SUBMITTED) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh',
            '@media (max-width: 700px)': {
              height: '50vh',
            },
          }}
        >
          <Loading />
        </Box>
      )}
      {uploadStatus === UploadStatus.ERROR && (
        <Message
          message="Error generating palette"
          color="error"
          callback={handleTryAgain}
          callbackText="Try again"
        />
      )}
      {(uploadStatus === UploadStatus.UPLOADED || uploadStatus === UploadStatus.SUBMITTING) && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: SPACING.SMALL.PX }}>
          <CanvasAndPalette photo={photo} palette={palette} updatePalette={setPalette} />
          <TextField
            variant="outlined"
            fullWidth
            label="Title"
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
              Clear Palette
            </Button>
            <Button
              disabled={!name || uploadStatus === UploadStatus.SUBMITTING}
              variant="contained"
              onClick={handleSavePalette}
            >
              Save Palette
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Create
