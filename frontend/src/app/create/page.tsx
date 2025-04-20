'use client'

import { Button } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { generatePalette } from '../../api/generatePalette'
import { savePalette } from '../../api/savePalette'
import { logger } from '../../services/logging'
import { Palette } from '../../types'
import Loading from '../sharedComponents/Loading'
import CanvasAndPalette from './components/CanvasAndPalette'
import Dropzone from './components/Dropzone'

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

  // const clearData = useCallback(() => {
  //   setPalette([])
  //   setUploadStatus(UploadStatus.INITIAL)
  //   setIsLoading(false)
  // }, [])

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
      {uploadStatus === UploadStatus.INITIAL && <Dropzone onDrop={onDrop} />}
      {uploadStatus === UploadStatus.UPLOADING && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}
        >
          <Loading />
        </div>
      )}
      {uploadStatus === UploadStatus.ERROR && (
        <div>
          <p>Error</p>
        </div>
      )}
      {uploadStatus === UploadStatus.UPLOADED && (
        <>
          <CanvasAndPalette
            palette={palette}
            handlePaletteChange={handlePaletteChange}
            photo={photo}
          />
          <Button variant="contained" onClick={handleSavePalette}>
            Save Palette
          </Button>
        </>
      )}
    </div>
  )
}

export default Create
