import React from 'react'
import Box from '@mui/material/Box'
import { SPACING, subtleBackground } from '../../styles/styleConsts'
// import { MODERATION_STATUS } from '../../types'
// import { getContrastColor } from '../../utils/getContrastColor'
import Message from '../../sharedComponents/Message'
// import ModerationPanel from '../../sharedComponents/ModerationPanel'
// import PageTitle from '../../styles/shared/PageTitle'
import PageWrapper from '../../styles/shared/PageWrapper'
// import Share from '../../sharedComponents/Share'
import { useQuery } from '@tanstack/react-query'
import { getPaletteById } from '../../api/palettes/getPaletteById'
import { useParams } from 'react-router-dom'
import Loading from '../../sharedComponents/Loading'
// import Favorite from '../../sharedComponents/Favorite'
// import BlurImage from '../../sharedComponents/BlurImage'
// import Link from '../../sharedComponents/Link'
import { styled } from '@mui/material/styles'
import Summary from './components/Summary'
import Controls from './components/Controls'
import type { PaletteControlsState } from './Palette.types'
import ColorDetails from './components/ColorDetails'
import { BACKGROUND_COLORS } from './Palette.consts'
import Share from '../../sharedComponents/Share'

const Palette = () => {
  const params = useParams()

  // Controls state
  const [controls, setControls] = React.useState<PaletteControlsState>({
    background: BACKGROUND_COLORS[0],
    details: 'none',
    mix: 'complementary',
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['palette', Array.isArray(params.id) ? params.id[0] : params.id],
    queryFn: () =>
      getPaletteById(Array.isArray(params.id) ? params.id[0] : params.id),
    retry: false,
  })

  if (isLoading) {
    return <Loading />
  }

  if (!data?.success || error) {
    return (
      <Message
        color="error"
        message="Palette not found or an error occurred."
      />
    )
  }

  return (
    <PageWrapper width="full">
      <Container>
        <LeftColumn>
          <Summary palette={data.palette} refetch={refetch} />
          <Controls controls={controls} setControls={setControls} />
        </LeftColumn>
        <RightColumn sx={{ backgroundColor: controls.background }}>
          <Share
            url={`palette/${data.palette.id}`}
            text={`${data.palette.name} by #${data.palette.appUserId.slice(0, 6)}`}
            media={data.palette.ogPhotoUrl}
          />
          {data.palette.colors.map((swatch) => (
            <ColorDetails
              colorMix={controls.mix}
              details={controls.details}
              swatch={swatch}
              key={swatch.id}
            />
          ))}
        </RightColumn>
      </Container>
    </PageWrapper>
  )
}

const LeftColumn = styled(Box)(({ theme }) => ({
  flexBasis: '300px',
  flexShrink: 0,
  padding: `${SPACING.MEDIUM.PX}`,

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

export default Palette
