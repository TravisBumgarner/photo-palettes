import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import React, { useCallback } from 'react'
import BlurImage from '../../../sharedComponents/BlurImage'
import ColorBar from '../../../sharedComponents/ColorBar'
import { MODAL_ID } from '../../../sharedComponents/Modal/Modal.consts'
import ModerationPanel from '../../../sharedComponents/ModerationPanel'
import { activeModalSignal } from '../../../signals'
import PageWrapper from '../../../styles/shared/PageWrapper'
import { SPACING, subtleBackground } from '../../../styles/styleConsts'
import { type TPalette } from '../../../types'
import downloadPalette from '../../../utils/downloadPalette'
import type { PaletteControlsState } from '../Palette.types'
import ColorDetails from './ColorDetails'
import Controls from './Controls'
import Summary from './Summary'
import { trackEvent } from '../../../services/analytics'

const PaletteDesktop = ({
  palette,
  refetch,
  controls,
  setControls,
}: {
  palette: TPalette
  refetch: () => void
  controls: PaletteControlsState
  setControls: React.Dispatch<React.SetStateAction<PaletteControlsState>>
}) => {
  const setPhotoAsModal = useCallback(() => {
    activeModalSignal.value = {
      id: MODAL_ID.LIGHTBOX_MODAL,
      palette,
    }
  }, [palette])

  const handleDownloadPalette = useCallback(() => {
    trackEvent({
      event: 'palette_download',
      properties: { source: 'palette_page' },
    })
    downloadPalette({
      paletteId: palette.id,
      photoUrl: palette.photoUrl,
      colors: palette.colors.map((c) => c.hex),
    })
  }, [palette])

  return (
    <PageWrapper width="full">
      <Container>
        <LeftColumn>
          <Summary palette={palette} refetch={refetch} isMobile={false} />
          <ColorBar
            interactive
            height={15}
            colors={palette.colors.map((c) => c.hex)}
          />

          <Box onClick={setPhotoAsModal} sx={{ cursor: 'pointer' }}>
            <BlurImage
              alt={`${palette.name} thumbnail`}
              src={palette.photoUrl}
              aspectRatio={palette.aspectRatio}
              blurHash={palette.blurhash}
              maxDimensions={{ maxHeight: '40vh' }}
            />
          </Box>
          <Button variant="outlined" onClick={handleDownloadPalette}>
            Download Palette
          </Button>
          <Controls controls={controls} setControls={setControls} />
        </LeftColumn>
        <RightColumn sx={{ backgroundColor: controls.background }}>
          {palette.colors.map((swatch, index) => (
            <ColorDetails
              index={index}
              colorMix={controls.mix}
              colorMode={controls.colorMode}
              swatch={swatch}
              key={swatch.id}
              backgroundColor={controls.background}
              toggleExploration={controls.toggleExploration}
            />
          ))}
        </RightColumn>
      </Container>
      <ModerationPanel
        refetch={refetch}
        moderationStatus={palette.moderationStatus}
        palette={palette}
      />
    </PageWrapper>
  )
}

const LeftColumn = styled(Box)(({ theme }) => ({
  flexBasis: '240px',
  flexShrink: 0,
  padding: `${SPACING.MEDIUM.PX}`,
  gap: SPACING.SMALL.PX,
  display: 'flex',
  flexDirection: 'column',

  position: 'sticky',
  top: '0px',
  left: '0px',
  backgroundColor: subtleBackground(theme.palette.mode, 'slightly'),
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

export default PaletteDesktop
