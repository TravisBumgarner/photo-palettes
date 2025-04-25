'use client'

import { Box, Button } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { savePalette } from '../../api/palettes/create'
import { generatePalette } from '../../api/palettes/generate'
import { logger } from '../../services/logging'
import useGlobalStore from '../../store'
import { TPalette } from '../../types'
import ErrorMessage from '../sharedComponents/ErrorMessage'
import Loading from '../sharedComponents/Loading'
import { ModalID } from '../sharedComponents/Modal/Modal.consts'
import CanvasAndPalette from './components/CanvasAndPalette'
import Dropzone from './components/Dropzone'
import { WIDTH } from './consts'

enum UploadStatus {
  INITIAL = 'INITIAL',
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  ERROR = 'ERROR',
}

const Create = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.INITIAL)
  const [palette, setPalette] = useState<TPalette>([])
  const [photo, setPhoto] = useState<File | null>(null)
  const router = useRouter()
  const [paletteId, setPaletteId] = useState<string | null>(null)
  const setActiveModal = useGlobalStore(state => state.setActiveModal)

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
        setPaletteId(response.palette_id)
        setUploadStatus(UploadStatus.UPLOADED)
      } else {
        setUploadStatus(UploadStatus.ERROR)
      }
    },
    [generatePaletteMutation]
  )

  const handleClearPalette = useCallback(() => {
    setPalette([])
    setUploadStatus(UploadStatus.INITIAL)
    setPhoto(null)
  }, [])

  const savePaletteMutation = useMutation({
    mutationFn: savePalette,
    onSuccess: () => {
      setUploadStatus(UploadStatus.UPLOADED)
    },
    onError: () => {
      logger.error('Error saving palette')
      setUploadStatus(UploadStatus.ERROR)
    },
  })

  const handleSavePalette = useCallback(async () => {
    if (!paletteId) return

    await savePaletteMutation.mutate({
      palette,
      paletteId,
      name: 'My Palette',
    })

    setActiveModal({
      id: ModalID.ConfirmationModal,
      confirmationCallback: () => {
        router.push(`/palette/${paletteId}`)
      },
      title: 'Thanks for your submission!',
      body: 'Once it is approved, it will be added to the site.',
    })
  }, [palette, paletteId, savePaletteMutation, setActiveModal, router])

  const handlePaletteChange = useCallback((palette: TPalette) => {
    setPalette(palette)
  }, [])

  const handleTryAgain = useCallback(() => {
    setUploadStatus(UploadStatus.INITIAL)
    setPalette([])
    setPhoto(null)
  }, [])

  return (
    <div>
      <h1>Create</h1>
      <Box
        sx={{
          margin: '0 auto',
          minHeight: '70vh',
          width: WIDTH,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {uploadStatus === UploadStatus.INITIAL && <Dropzone onDrop={onDrop} />}
        {uploadStatus === UploadStatus.UPLOADING && <Loading />}
        {uploadStatus === UploadStatus.ERROR && (
          <ErrorMessage error="Error generating palette" callback={handleTryAgain} />
        )}
        {uploadStatus === UploadStatus.UPLOADED && (
          <Box>
            <CanvasAndPalette
              palette={palette}
              handlePaletteChange={handlePaletteChange}
              photo={photo}
            />
            <Button variant="contained" onClick={handleClearPalette}>
              Clear Palette
            </Button>
            <Button variant="contained" onClick={handleSavePalette}>
              Save Palette
            </Button>
          </Box>
        )}
      </Box>
    </div>
  )
}

export default Create
