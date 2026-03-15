import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { getPaletteById } from '../../api/palettes/getPaletteById'
import Loading from '../../sharedComponents/Loading'
import Message from '../../sharedComponents/Message'
import PageWrapper from '../../styles/shared/PageWrapper'

import useMediaQuery from '../../hooks/UseMediaQuery'
import { MODERATION_STATUS } from '../../types'
import { BACKGROUND_COLORS } from './Palette.consts'
import type { PaletteControlsState } from './Palette.types'
import PaletteDesktop from './components/Palette.Desktop'
import PaletteMobile from './components/Palette.Mobile'

const Palette = () => {
  const params = useParams()
  const isDesktop = useMediaQuery('(min-width:600px)')
  const [controls, setControls] = React.useState<PaletteControlsState>({
    background: BACKGROUND_COLORS[0],
    colorMode: 'none',
    mix: 'none',
    toggleExploration: 'on',
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['palette', Array.isArray(params.id) ? params.id[0] : params.id],
    queryFn: () =>
      getPaletteById(Array.isArray(params.id) ? params.id[0] : params.id),
    retry: false,
  })

  if (isLoading) {
    return (
      <PageWrapper minHeight width="full">
        <Loading />
      </PageWrapper>
    )
  }

  if (!data?.success || error) {
    return (
      <PageWrapper minHeight width="full">
        <Message
          color="error"
          message="Palette not found or an error occurred."
        />
      </PageWrapper>
    )
  }

  return (
    <>
      {data.palette.moderationStatus === MODERATION_STATUS.PRIVATE && (
        <Message
          includeVerticalMargin
          message="This palette is in your private library."
          color="info"
        />
      )}
      {data.palette.moderationStatus ===
        MODERATION_STATUS.AWAITING_MODERATION && (
        <Message
          includeVerticalMargin
          message="This palette is pending approval."
          color="info"
        />
      )}
      {data.palette.moderationStatus === MODERATION_STATUS.REJECTED && (
        <Message
          includeVerticalMargin
          message="This palette was rejected."
          color="error"
        />
      )}
      {isDesktop ? (
        <PaletteDesktop
          controls={controls}
          setControls={setControls}
          refetch={refetch}
          palette={data.palette}
        />
      ) : (
        <PaletteMobile
          controls={controls}
          refetch={refetch}
          setControls={setControls}
          palette={data.palette}
        />
      )}
    </>
  )
}

export default Palette
