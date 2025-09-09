import React from 'react'
import Box from '@mui/material/Box'
import { SPACING, subtleBackground } from '../../../styles/styleConsts'
import Message from '../../../sharedComponents/Message'
import PageWrapper from '../../../styles/shared/PageWrapper'
import { styled } from '@mui/material/styles'
import Summary from './Summary'
import Controls from './Controls'
import type { PaletteControlsState } from '../Palette.types'
import ColorDetails from './ColorDetails'
import ModerationPanel from '../../../sharedComponents/ModerationPanel'
import { MODERATION_STATUS, type TPalette } from '../../../types'

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
      <p>Desktop</p>
      {palette.moderationStatus === MODERATION_STATUS.AWAITING_MODERATION && (
        <Message
          includeVerticalMargin
          message="This palette is pending approval."
          color="info"
        />
      )}
      {palette.moderationStatus === MODERATION_STATUS.REJECTED && (
        <Message
          includeVerticalMargin
          message="This palette was rejected."
          color="error"
        />
      )}
      <Container>
        <LeftColumn>
          <Summary palette={palette} refetch={refetch} />
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

export default PaletteDesktop
