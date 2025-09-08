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
import { SPACING, subtleBackground } from '../../styles/styleConsts'
import { type TGeneratedPalette } from '../../types'
import { resizeImage } from '../../utils/image'
import CanvasAndPalette from './components/CanvasAndPalette'
import Dropzone from './components/Dropzone'
import SelectGeneratedPalette from './components/SelectGeneratedPalette'
import { sharedCSS } from './components/shared'
import { queries } from '../../database'
import { styled } from '@mui/material/styles'
import { PALETTE_SIZE } from '../../consts'

type CreationStatus =
  | 'INITIAL'
  | 'UPLOADING'
  | 'SELECTING_COLORS'
  | 'SUBMITTING'
  | 'SUBMITTED'
  | 'ERROR'

const MAX_NAME_LENGTH = 50

const Create = () => {
  const [creationStatus, setCreationStatus] =
    useState<CreationStatus>('INITIAL')
  const [photo, setPhoto] = useState<Blob | null>(null)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [generatedPalettes, setGeneratedPalettes] = useState<
    TGeneratedPalette[]
  >([])
  const [palette, setPalette] = useState<TGeneratedPalette | null>(null)
  const [paletteSortOrder, setPaletteSortOrder] = useState<number[]>(
    Array.from({ length: PALETTE_SIZE }, (_, i) => i)
  )
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
        setCreationStatus('SELECTING_COLORS')
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
      setCreationStatus('ERROR')
    },
  })
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        // An error was thrown, it's handled internally by Dropzone.tsx
        return
      }
      setCreationStatus('UPLOADING')
      const photo = acceptedFiles[0]
      const resizedPhoto = await resizeImage(photo, {
        maxWidth: 1600,
        maxHeight: 1600,
      })
      setPhoto(resizedPhoto)
      const response = await generatePaletteMutation.mutateAsync(resizedPhoto)
      if (response.success) {
        setCreationStatus('SELECTING_COLORS')
        setGeneratedPalettes(response.palettes)
        setPalette(response.palettes[0])
      } else {
        setCreationStatus('ERROR')
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
    setCreationStatus('INITIAL')
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
      setCreationStatus('ERROR')
    },
  })

  const handleSavePalette = useCallback(async () => {
    if (!palette || !photo) return
    setCreationStatus('SUBMITTING')

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
      setCreationStatus('SUBMITTED')
    } else {
      setCreationStatus('ERROR')
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

  const handlePaletteChange = (palette: TGeneratedPalette) => {
    setPalette(palette)
    setPaletteSortOrder(Array.from({ length: PALETTE_SIZE }, (_, i) => i))
  }

  const handleTryAgain = useCallback(() => {
    setCreationStatus('INITIAL')
    setPalette(null)
    setPhoto(null)
    setName('')
  }, [setPalette, setPhoto])

  const nameLabel =
    name.length > 0 ? `Name: ${name.length} / ${MAX_NAME_LENGTH}` : 'Name'

  if (creationStatus === 'INITIAL') {
    return (
      <PageWrapper width="full">
        <Dropzone onDrop={onDrop} />
      </PageWrapper>
    )
  }

  if (creationStatus === 'ERROR') {
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
    creationStatus === 'UPLOADING' ||
    creationStatus === 'SUBMITTING' ||
    creationStatus === 'SUBMITTED'
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
    // creationStatus === 'selecting_colors
    <PageWrapper width="full">
      <Container>
        <LeftColumn>
          <SelectGeneratedPalette
            handlePaletteChange={handlePaletteChange}
            generatedPalettes={generatedPalettes}
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
              justifyContent: 'space-between',
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
        </LeftColumn>
        <RightColumn>
          <CanvasAndPalette
            photo={photo}
            palette={palette}
            updateSwatch={updateSwatch}
            paletteSortOrder={paletteSortOrder}
            setPaletteSortOrder={setPaletteSortOrder}
          />
        </RightColumn>
      </Container>
    </PageWrapper>
  )
}

const LeftColumn = styled(Box)(({ theme }) => ({
  flexBasis: '300px',
  flexShrink: 0,
  padding: `${SPACING.MEDIUM.PX}`,
  minHeight: '100vh',

  position: 'sticky',
  top: '0px',
  left: '0px',
  backgroundColor: subtleBackground(theme.palette.mode),
}))

const RightColumn = styled(Box)(() => ({
  padding: SPACING.MEDIUM.PX,
  flexGrow: 1,
  overflow: 'hidden',
}))

const Container = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-start', // important, avoid stretch
}))

export default Create
