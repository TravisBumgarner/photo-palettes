import React from 'react'
import Message from '../../sharedComponents/Message'
import PageWrapper from '../../styles/shared/PageWrapper'
import { useQuery } from '@tanstack/react-query'
import { getPaletteById } from '../../api/palettes/getPaletteById'
import { useParams } from 'react-router-dom'
import Loading from '../../sharedComponents/Loading'

import type { PaletteControlsState } from './Palette.types'
import { BACKGROUND_COLORS } from './Palette.consts'
import PaletteMobile from './components/Palette.Mobile'
import PaletteDesktop from './components/Palette.Desktop'
import { MODERATION_STATUS } from '../../types'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

const Palette = () => {
  const params = useParams()
  const theme = useTheme()
  const isFullWidth = useMediaQuery(theme.breakpoints.up('sm'))
  const [controls, setControls] = React.useState<PaletteControlsState>({
    background: BACKGROUND_COLORS[0],
    details: 'none',
    mix: 'none',
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
      {isFullWidth ? (
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
