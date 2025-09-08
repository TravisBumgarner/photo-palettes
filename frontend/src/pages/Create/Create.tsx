import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPalette } from '../../api/palettes/createPalette'
import { generatePalette } from '../../api/palettes/generatePalette'
import { logger } from '../../services/logging'
import Loading from '../../sharedComponents/Loading'
import Message from '../../sharedComponents/Message'
import { MODAL_ID } from '../../sharedComponents/Modal/Modal.types'
import { activeModalSignal } from '../../signals'
import PageWrapper from '../../styles/shared/PageWrapper'
import { SPACING } from '../../styles/styleConsts'
import { type TGeneratedPalette } from '../../types'
import { resizeImage } from '../../utils/image'
import CanvasAndPalette from './components/CanvasAndPalette'
import Dropzone from './components/Dropzone'
import SelectGeneratedPalette from './components/SelectGeneratedPalette'
import { sharedCSS } from './components/shared'
import { queries } from '../../database'

type UploadStatus =
  | 'INITIAL'
  | 'UPLOADING'
  | 'SELECTING_GENERATED_PALETTE'
  | 'PALETTE_SELECTED'
  | 'ERROR'
  | 'SUBMITTING'
  | 'SUBMITTED'

const MAX_NAME_LENGTH = 50

const Create = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('INITIAL')
  const [photo, setPhoto] = useState<Blob | null>(null)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [generatedPalettes, setGeneratedPalettes] = useState<
    TGeneratedPalette[]
  >([])
  const [palette, setPalette] = useState<TGeneratedPalette | null>(null)
  const [paletteSortOrder, setPaletteSortOrder] = useState<number[]>([])
  const [tempId, setTempId] = useState<string | null>(null)

  useEffect(() => {
    // When the user is signed out, they can create palettes via CreateLite.tsx
    // If they opt to sign up or login, they'll be redirected here after. We'll
    // load their data into state.
    const checkAndLoadTemporaryPalette = async () => {
      const temporaryPalettes = await queries.getTemporaryPalettes()
      if (temporaryPalettes.length > 0) {
        const {
          palette,
          name,
          image,
          tempId: loadedTempId,
        } = temporaryPalettes[0]
        setPalette(palette)
        setPhoto(await image)
        setName(name)
        setTempId(loadedTempId)
        setUploadStatus('PALETTE_SELECTED')
        setPaletteSortOrder(Array.from({ length: palette.length }, (_, i) => i))
      }
    }
    checkAndLoadTemporaryPalette()
  }, [])

  const updateSwatch = useCallback(
    (index: number, color: string, percentLocation: [number, number]) => {
      setPalette((prev) => {
        if (!prev) return prev
        const updated = [...prev]
        updated[index].color = color
        updated[index].percentLocation = percentLocation
        return updated
      })
    },
    []
  )
  const generatePaletteMutation = useMutation({
    mutationFn: generatePalette,
    // onSuccess: () => {
    //   setUploadStatus('UPLOADED')
    // },
    onError: () => {
      logger.error('Error generating palette')
      setUploadStatus('ERROR')
    },
  })

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
      const response = await generatePaletteMutation.mutateAsync(resizedPhoto)
      if (response.success) {
        setGeneratedPalettes(response.palettes)
        // setPaletteSortOrder(
        //   Array.from({ length: response.palette.length }, (_, i) => i)
        // )
        setUploadStatus('SELECTING_GENERATED_PALETTE')
      } else {
        setUploadStatus('ERROR')
      }
    },
    [generatePaletteMutation, setGeneratedPalettes]
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
    if (tempId) {
      queries.deleteTemporaryPalette(tempId)
    }
  }, [setPalette, tempId])

  const createPaletteMutation = useMutation({
    mutationFn: createPalette,
    // onSuccess: () => {
    //   setUploadStatus('UPLOADED')
    // },
    onError: () => {
      logger.error('Error saving palette')
      setUploadStatus('ERROR')
    },
  })

  const handleSavePalette = useCallback(async () => {
    if (!palette || !photo) return
    setUploadStatus('SUBMITTING')

    const sortedPalette = paletteSortOrder.map((index) => palette[index])
    const response = await createPaletteMutation.mutateAsync({
      generatedPalette: sortedPalette,
      name,
      image: photo,
    })

    if (response.success) {
      if (tempId) queries.deleteTemporaryPalette(tempId)
      activeModalSignal.value = {
        id: MODAL_ID.CONFIRMATION_MODAL,
        confirmationCallback: () => {
          navigate(`/palette/${response.paletteId}`)
        },
        title: 'Thanks for your submission!',
        body: 'Once it is approved, it will be added to the site.',
      }
      setUploadStatus('SUBMITTED')
    } else {
      setUploadStatus('ERROR')
    }
  }, [
    createPaletteMutation,
    name,
    palette,
    navigate,
    paletteSortOrder,
    photo,
    tempId,
  ])

  const handlePaletteSelection = useCallback((palette: TGeneratedPalette) => {
    setPalette(palette)
    setPaletteSortOrder(Array.from({ length: palette.length }, (_, i) => i))
    setUploadStatus('PALETTE_SELECTED')
  }, [])

  const handleTryAgain = useCallback(() => {
    setUploadStatus('INITIAL')
    setPalette(null)
    setPhoto(null)
    setName('')
  }, [setPalette, setPhoto])

  const nameLabel =
    name.length > 0 ? `Name: ${name.length} / ${MAX_NAME_LENGTH}` : 'Name'

  if (uploadStatus === 'INITIAL') {
    return (
      <PageWrapper width="full">
        <Dropzone onDrop={onDrop} />
      </PageWrapper>
    )
  }

  if (uploadStatus === 'SELECTING_GENERATED_PALETTE') {
    return (
      <PageWrapper width="full">
        <SelectGeneratedPalette
          handlePaletteSelection={handlePaletteSelection}
          generatedPalettes={generatedPalettes}
        />
      </PageWrapper>
    )
  }

  if (uploadStatus === 'ERROR') {
    return (
      <PageWrapper width="full">
        <Message
          message="Error generating palette"
          color="error"
          callback={handleTryAgain}
          callbackText="Try again"
        />
      </PageWrapper>
    )
  }

  if (
    uploadStatus === 'UPLOADING' ||
    uploadStatus === 'SUBMITTING' ||
    uploadStatus === 'SUBMITTED'
  ) {
    return (
      <PageWrapper width="full">
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
      </PageWrapper>
    )
  }

  return (
    <PageWrapper width="full">
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
            disabled={!name}
            variant="contained"
            onClick={handleSavePalette}
          >
            Save
          </Button>
        </Box>
      </Box>
    </PageWrapper>
  )
}

export default Create
