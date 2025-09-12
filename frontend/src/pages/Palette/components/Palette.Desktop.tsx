import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import React from 'react'
import BlurImage from '../../../sharedComponents/BlurImage'
import ColorBar from '../../../sharedComponents/ColorBar'
import ModerationPanel from '../../../sharedComponents/ModerationPanel'
import PageWrapper from '../../../styles/shared/PageWrapper'
import { SPACING, subtleBackground } from '../../../styles/styleConsts'
import { type TPalette } from '../../../types'
import type { PaletteControlsState } from '../Palette.types'
import ColorDetails from './ColorDetails'
import Controls from './Controls'
import Summary from './Summary'

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
          <BlurImage
            alt={`${palette.name} thumbnail`}
            src={palette.photoUrl}
            aspectRatio={palette.aspectRatio}
            blurHash={palette.blurhash}
            maxDimensions={{ maxHeight: '40vh' }}
          />
          <Controls controls={controls} setControls={setControls} />
        </LeftColumn>
        <RightColumn sx={{ backgroundColor: controls.background }}>
          {palette.colors.map((swatch, index) => (
            <ColorDetails
              index={index}
              colorMix={controls.mix}
              details={controls.details}
              swatch={swatch}
              key={swatch.id}
            />
          ))}
        </RightColumn>
      </Container>
      <ModerationPanel
        refetch={refetch}
        moderationStatus={palette.moderationStatus}
        paletteId={palette.id}
      />
    </PageWrapper>
  )
}

const LeftColumn = styled(Box)(({ theme }) => ({
  flexBasis: '250px',
  flexShrink: 0,
  padding: `${SPACING.MEDIUM.PX}`,
  minHeight: '100vh',
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
