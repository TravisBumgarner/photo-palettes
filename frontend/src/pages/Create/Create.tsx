import { Capacitor } from '@capacitor/core'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { styled, type SxProps } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { createPalette } from '../../api/palettes/createPalette'
import { generatePalette as generatePaletteFull } from '../../api/palettes/generatePalette'
import { PALETTE_SIZE } from '../../consts'
import { queries } from '../../database'
import { useGeneratePaletteWorker } from '../../hooks/useGeneratePaletteWorker'
import useMediaQuery from '../../hooks/UseMediaQuery'
import { trackEvent } from '../../services/analytics'
import { logger } from '../../services/logging'
import Loading from '../../sharedComponents/Loading'
import Message from '../../sharedComponents/Message'
import { MODAL_ID } from '../../sharedComponents/Modal/Modal.consts'
import { activeModalSignal } from '../../signals'
import PageWrapper from '../../styles/shared/PageWrapper'
import { FONT_SIZES, SPACING, subtleBackground } from '../../styles/styleConsts'
import type { TGeneratePaletteResponse, TGeneratedPaletteWithName } from '../../types'
import { type TGeneratedPalette } from '../../types'
import { resizeImage } from '../../utils/image'
import CanvasAndPalette from './components/CanvasAndPalette'
import Dropzone from './components/Dropzone'
import SelectGeneratedPalette from './components/SelectGeneratedPalette'
import { sharedCSS } from './components/shared'
import Alert from '@mui/material/Alert'

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
  const isSmallScreen = useMediaQuery('(max-width:700px)')
  const isNative = Capacitor.isNativePlatform()
  const [wasLoadedFromLiteMode, setWasLoadedFromLiteMode] = useState(false)
  const [photo, setPhoto] = useState<Blob | null>(null)
  const [creationStatus, setCreationStatus] =
    useState<CreationStatus>('INITIAL')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const useSingleColumnDisplay = isNative || isSmallScreen

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [generatedPalettes, setGeneratedPalettes] = useState<
    TGeneratedPaletteWithName[]
  >([])
  const [palette, setPalette] = useState<TGeneratedPalette | null>(null)
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState(0)

  const [paletteSortOrder, setPaletteSortOrder] = useState<number[]>(
    Array.from({ length: PALETTE_SIZE }, (_, i) => i)
  )
  const [shareWithPublic, setShareWithPublic] = useState(false)
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
        setWasLoadedFromLiteMode(true)
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
      setErrorMessage(
        'There was an error processing your image. Please try a different image.'
      )
      setCreationStatus('ERROR')
    },
  })
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      trackEvent({ event: 'create_photo_selected', properties: { mode } })
      if (acceptedFiles.length === 0) {
        // An error was thrown, it's handled internally by Dropzone.tsx
        return
      }

      setCreationStatus('UPLOADING')
      const photo = acceptedFiles[0]

      let resizedPhoto: Blob
      try {
        resizedPhoto = await resizeImage(photo, {
          maxWidth: 1600,
          maxHeight: 1600,
        })
      } catch (e) {
        logger.error('Error resizing image', e)
        setErrorMessage(
          'There was an error loading your image. Please try a different image.'
        )
        setCreationStatus('ERROR')
        return
      }

      setPhoto(resizedPhoto)

      let response: TGeneratePaletteResponse
      if (mode === 'lite') {
        const photoUrl = URL.createObjectURL(resizedPhoto)
        response = await generatePaletteLite(photoUrl)
      } else {
        response = await generatePaletteFullMutation.mutateAsync(resizedPhoto)
      }
      if (response.success) {
        trackEvent({ event: 'create_photo_loaded', properties: { mode } })

        setCreationStatus('SELECTING_COLORS')

        setGeneratedPalettes(response.palettes)
        setPalette(structuredClone(response.palettes[0].swatches))
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
    setCreationStatus('SUBMITTED')

    const sortedPalette = paletteSortOrder.map((index) => palette[index])

    activeModalSignal.value = {
      id: MODAL_ID.ANON_PALETTE_CREATION_MODAL,
      palette: sortedPalette,
      photoUrl: URL.createObjectURL(photo!),
      paletteId: uuidv4(),
      name,
    }
  }, [name, palette, paletteSortOrder, photo])

  const handleSaveFullCallback = useCallback(
    (paletteId: string) => {
      trackEvent({
        event: 'create_palette_created',
        properties: {
          mode: wasLoadedFromLiteMode ? 'lite' : 'full',
        },
      })
      navigate(`/palette/${paletteId}`)
    },
    [navigate, wasLoadedFromLiteMode]
  )

  const handleSaveFull = useCallback(async () => {
    if (!palette || !photo) return
    setCreationStatus('SUBMITTING')

    const sortedPalette = paletteSortOrder.map((index) => palette[index])
    const response = await createPaletteMutation.mutateAsync({
      generatedPalette: sortedPalette,
      name,
      image: photo,
      shareWithPublic,
    })

    if (response.success) {
      if (tempId) queries.deleteTemporaryPalette(tempId)
      activeModalSignal.value = {
        id: MODAL_ID.CONFIRMATION_MODAL,
        confirmationCallback: () => handleSaveFullCallback(response.paletteId),
        title: shareWithPublic
          ? 'Thanks for your submission!'
          : 'Palette saved!',
        body: shareWithPublic
          ? 'Once approved, it will appear on the browse page.'
          : 'Your palette has been saved to your library.',
      }
      setCreationStatus('SUBMITTED')
    } else {
      setCreationStatus('ERROR')
    }
  }, [
    createPaletteMutation,
    handleSaveFullCallback,
    name,
    palette,
    paletteSortOrder,
    photo,
    shareWithPublic,
    tempId,
  ])

  const handleSavePalette = useCallback(async () => {
    trackEvent({
      event: 'create_palette_save',
      properties: { mode, lite_mode_conversion: wasLoadedFromLiteMode },
    })
    if (mode === 'full') handleSaveFull()
    else handleSaveLite()
  }, [handleSaveFull, handleSaveLite, mode, wasLoadedFromLiteMode])

  const handlePaletteChange = (paletteIndex: number) => {
    setPalette(structuredClone(generatedPalettes[paletteIndex].swatches))
    setSelectedPaletteIndex(paletteIndex)
    resetSortOrder()
  }

  const handleTryAgain = useCallback(() => {
    setCreationStatus('INITIAL')
    setPalette(null)
    setErrorMessage(null)
    setPhoto(null)
    setName('')
  }, [setPalette, setPhoto])

  const nameLabel =
    name.length > 0 ? `Name: ${name.length} / ${MAX_NAME_LENGTH}` : 'Name'

  if (creationStatus === 'INITIAL') {
    return (
      <PageWrapper width="full">
        {mode === 'lite' && <Alert severity="info" sx={{ mb: SPACING.MEDIUM.PX }}>
          Heads up: you're in Lite Mode - no login needed. Log in to save, or download your results.
        </Alert>}
        <Dropzone onDrop={onDrop} />
      </PageWrapper>
    )
  }

  if (creationStatus === 'ERROR') {
    return (
      <PageWrapper width="full">
        <Message
          message={errorMessage || 'An error occurred. Please try again.'}
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
    <PageWrapper width="full">
      {mode === 'lite' && <Alert severity="info" sx={{ mb: SPACING.MEDIUM.PX }}>
        Heads up: you're in Lite Mode - no login needed. Log in to save, or download your results.
      </Alert>}
      <Container useSingleColumnDisplay={useSingleColumnDisplay}>
        {/* 
          When mode === 'lite' && useSingleColumnDisplay ? null
          LeftColumn becomes empty. No GeneratedPalettes are shown
          and the TextField is moved to the right column.
          Therefore, hide it.
        */}
        {mode === 'lite' && useSingleColumnDisplay ? null : (
          <LeftColumn useSingleColumnDisplay={useSingleColumnDisplay}>
            {mode === 'full' && (
              <SectionWrapper>
                <Typography sx={labelStyles}>Starter Palettes</Typography>
                <SelectGeneratedPalette
                  useSingleColumnDisplay={useSingleColumnDisplay}
                  handlePaletteChange={handlePaletteChange}
                  generatedPalettes={generatedPalettes}
                />
              </SectionWrapper>
            )}
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={shareWithPublic}
                        onChange={(e) => setShareWithPublic(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Share with public"
                  />
                  {shareWithPublic && (
                    <Typography variant="caption" color="text.secondary">
                      Your palette will be reviewed and may be featured on the public browse page
                    </Typography>
                  )}
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
        )}
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={shareWithPublic}
                      onChange={(e) => setShareWithPublic(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Share with public"
                />
                {shareWithPublic && (
                  <Typography variant="caption" color="text.secondary">
                    Your palette will be reviewed and may be featured on the public browse page
                  </Typography>
                )}
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
    backgroundColor: subtleBackground(theme.palette.mode, 'slightly'),
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
  gap: SPACING.MEDIUM.PX,
  alignItems: 'flex-start',
}))

export default Create
