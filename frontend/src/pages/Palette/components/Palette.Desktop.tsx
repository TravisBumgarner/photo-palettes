import React from 'react'
import Box from '@mui/material/Box'
import { SPACING, subtleBackground } from '../../../styles/styleConsts'
import PageWrapper from '../../../styles/shared/PageWrapper'
import { styled } from '@mui/material/styles'
import Summary from './Summary'
import Controls from './Controls'
import type { PaletteControlsState } from '../Palette.types'
import ColorDetails from './ColorDetails'
import ModerationPanel from '../../../sharedComponents/ModerationPanel'
import { type TPalette } from '../../../types'

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
          <ModerationPanel
            refetch={refetch}
            moderationStatus={palette.moderationStatus}
            paletteId={palette.id}
          />
        </RightColumn>
      </Container>
    </PageWrapper>
  )
}

const LeftColumn = styled(Box)(({ theme }) => ({
  flexBasis: '240px',
  flexShrink: 0,
  padding: `${SPACING.MEDIUM.PX}`,
  minHeight: '100vh',
  gap: SPACING.MEDIUM.PX,
  display: 'flex',
  flexDirection: 'column',

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

export default PaletteDesktop
