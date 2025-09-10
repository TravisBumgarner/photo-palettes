import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPalette } from '../../api/palettes/createPalette'
import { generatePalette as generatePaletteFull } from '../../api/palettes/generatePalette'
import { useGeneratePaletteWorker } from '../../hooks/useGeneratePaletteWorker'
import { logger } from '../../services/logging'
import Loading from '../../sharedComponents/Loading'
import Message from '../../sharedComponents/Message'
import { MODAL_ID } from '../../sharedComponents/Modal/Modal.types'
import { activeModalSignal } from '../../signals'
import PageWrapper from '../../styles/shared/PageWrapper'
import { FONT_SIZES, SPACING, subtleBackground } from '../../styles/styleConsts'
import { type TGeneratedPalette } from '../../types'
import { resizeImage } from '../../utils/image'
import CanvasAndPalette from './components/CanvasAndPalette'
import Dropzone from './components/Dropzone'
import SelectGeneratedPalette from './components/SelectGeneratedPalette'
import { sharedCSS } from './components/shared'
import { queries } from '../../database'
import { styled, useTheme, type SxProps } from '@mui/material/styles'
import { PALETTE_SIZE } from '../../consts'
import Typography from '@mui/material/Typography'
import { v4 as uuidv4 } from 'uuid'
import type { TGeneratePaletteResponse } from '../../types'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Capacitor } from '@capacitor/core'

type CreationStatus =
  | 'INITIAL'
  | 'UPLOADING'
  | 'SELECTING_COLORS'
  | 'SUBMITTING'
  | 'SUBMITTED'
  | 'ERROR'

const MAX_NAME_LENGTH = 50

const Create = ({ mode }: { mode: 'lite' | 'full' }) => {
  const { generatePalette: generatePaletteLite } = useGeneratePaletteWorker()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const isNative = Capacitor.isNativePlatform()

  const useSingleColumnDisplay = isNative || isSmallScreen

  const [creationStatus, setCreationStatus] =
    useState<CreationStatus>('INITIAL')
  const [photo, setPhoto] = useState<Blob | null>(null)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [generatedPalettes, setGeneratedPalettes] = useState<
    TGeneratedPalette[]
  >([])
  const [palette, setPalette] = useState<TGeneratedPalette | null>(null)
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState(0)

  const [paletteSortOrder, setPaletteSortOrder] = useState<number[]>(
    Array.from({ length: PALETTE_SIZE }, (_, i) => i)
  )
  const [tempId, setTempId] = useState<string | null>(null)

  useEffect(() => {
    // When the user is signed out, they can create palettes.
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
        setPalette(structuredClone(palette))
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

  const resetSortOrder = useCallback(() => {
    setPaletteSortOrder(Array.from({ length: PALETTE_SIZE }, (_, i) => i))
  }, [setPaletteSortOrder])

  const generatePaletteFullMutation = useMutation({
    mutationFn: generatePaletteFull,
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

      let response: TGeneratePaletteResponse
      if (mode === 'lite') {
        const photoUrl = URL.createObjectURL(resizedPhoto)
        response = await generatePaletteLite(photoUrl)
      } else {
        response = await generatePaletteFullMutation.mutateAsync(resizedPhoto)
      }
      if (response.success) {
        setCreationStatus('SELECTING_COLORS')

        setGeneratedPalettes(response.palettes)
        setPalette(structuredClone(response.palettes[0]))
      } else {
        setCreationStatus('ERROR')
      }
    },
    [
      generatePaletteFullMutation,
      setGeneratedPalettes,
      setCreationStatus,
      mode,
      generatePaletteLite,
    ]
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
    setSelectedPaletteIndex(0)
    if (tempId) {
      queries.deleteTemporaryPalette(tempId)
    }
  }, [setPalette, tempId])

  const createPaletteMutation = useMutation({
    mutationFn: createPalette,
    onError: () => {
      logger.error('Error saving palette')
      setCreationStatus('ERROR')
    },
  })

  const handleSaveLite = useCallback(() => {
    if (!palette) return
    setCreationStatus('SUBMITTING')

    const sortedPalette = paletteSortOrder.map((index) => palette[index])

    activeModalSignal.value = {
      id: MODAL_ID.ANON_PALETTE_CREATION_MODAL,
      palette: sortedPalette,
      photoUrl: URL.createObjectURL(photo!),
      paletteId: uuidv4(),
      name,
    }
  }, [name, palette, paletteSortOrder, photo])

  const handleSaveFull = useCallback(async () => {
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

  const handleSavePalette = useCallback(async () => {
    if (mode === 'full') handleSaveFull()
    else handleSaveLite()
  }, [handleSaveFull, handleSaveLite, mode])

  const handlePaletteChange = (paletteIndex: number) => {
    setPalette(structuredClone(generatedPalettes[paletteIndex]))
    setSelectedPaletteIndex(paletteIndex)
    resetSortOrder()
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
      <Container useSingleColumnDisplay={useSingleColumnDisplay}>
        <LeftColumn useSingleColumnDisplay={useSingleColumnDisplay}>
          <SectionWrapper>
            <Typography sx={labelStyles}>Generated Palette(s)</Typography>
            <SelectGeneratedPalette
              handlePaletteChange={handlePaletteChange}
              generatedPalettes={generatedPalettes}
            />
          </SectionWrapper>
          {!useSingleColumnDisplay && (
            <>
              <SectionWrapper>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  label={nameLabel}
                  placeholder="Name your palette"
                  value={name}
                  onChange={handleNameChange}
                />
              </SectionWrapper>

              <SectionWrapper>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button variant="text" onClick={handleClearPalette}>
                    Clear
                  </Button>
                  <Button
                    disabled={!name}
                    variant="contained"
                    sx={{ flexGrow: 1 }}
                    onClick={handleSavePalette}
                  >
                    Save
                  </Button>
                </Box>
              </SectionWrapper>
            </>
          )}
        </LeftColumn>
        <RightColumn>
          <CanvasAndPalette
            photo={photo}
            palette={palette}
            selectedPaletteIndex={selectedPaletteIndex}
            updateSwatch={updateSwatch}
            paletteSortOrder={paletteSortOrder}
            setPaletteSortOrder={setPaletteSortOrder}
          />
          {useSingleColumnDisplay && (
            <>
              <SectionWrapper>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  label={nameLabel}
                  placeholder="Name your palette"
                  value={name}
                  onChange={handleNameChange}
                />
              </SectionWrapper>

              <SectionWrapper>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button variant="text" onClick={handleClearPalette}>
                    Clear
                  </Button>
                  <Button
                    disabled={!name}
                    variant="contained"
                    sx={{ flexGrow: 1 }}
                    onClick={handleSavePalette}
                  >
                    Save
                  </Button>
                </Box>
              </SectionWrapper>
            </>
          )}
        </RightColumn>
      </Container>
    </PageWrapper>
  )
}

const SectionWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: SPACING.TINY.PX,
  flexDirection: 'column',
  width: '100%',
}))

const labelStyles: SxProps = {
  fontSize: FONT_SIZES.SMALL.PX,
}

const LeftColumn = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'useSingleColumnDisplay',
})<{ useSingleColumnDisplay: boolean }>(
  ({ theme, useSingleColumnDisplay }) => ({
    ...(useSingleColumnDisplay ? {} : { flexBasis: '200px' }),
    width: '100%',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.MEDIUM.PX,
    padding: SPACING.MEDIUM.PX,
    backgroundColor: subtleBackground(theme.palette.mode),
  })
)
const RightColumn = styled(Box)(() => ({
  flexGrow: 1,
  gap: SPACING.MEDIUM.PX,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
}))

const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'useSingleColumnDisplay',
})<{ useSingleColumnDisplay: boolean }>(({ useSingleColumnDisplay }) => ({
  display: 'flex',
  flexDirection: useSingleColumnDisplay ? 'column' : 'row',
  gap: '16px', // or SPACING.MEDIUM.PX
  alignItems: 'flex-start',
}))

export default Create
