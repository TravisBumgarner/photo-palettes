'use client'

import { Box, Button } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { generatePalette } from '../../api/generatePalette'
import { savePalette } from '../../api/savePalette'
import { logger } from '../../services/logging'
import { Palette } from '../../types'
import Loading from '../sharedComponents/Loading'
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
  const [palette, setPalette] = useState<Palette>([])
  const [photo, setPhoto] = useState<File | null>(null)

  const [paletteId, setPaletteId] = useState<string | null>(null)

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
      setPalette(response.palette)
      setPaletteId(response.palette_id)
      setUploadStatus(UploadStatus.UPLOADED)
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

  const handleSavePalette = useCallback(() => {
    if (!paletteId) return
    savePaletteMutation.mutate({
      palette,
      paletteId,
      name: 'My Palette',
    })
  }, [palette, paletteId, savePaletteMutation])

  const handlePaletteChange = useCallback((palette: Palette) => {
    setPalette(palette)
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
          <div>
            <p>Error</p>
          </div>
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
