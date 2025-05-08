'use client'

import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import getPaletteListModerated from '../../api/palettes/getPaletteListModerated'
import { logger } from '../../services/logging'
import { ThumbnailGridDisplay } from '../../styles/Shared'
import { SPACING } from '../../styles/Theme'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'

const Browse = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['palettes'],
    queryFn: getPaletteListModerated,
    retry: false,
  })

  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  if (isLoading || !data) {
    return <Loading />
  }

  if (error) {
    return <Message message="Error fetching palettes" color="error" />
  }

  if (!data.success) {
    return <Message message="Error fetching palettes" color="error" />
  }

  return (
    <Box sx={{ margin: `${SPACING.MEDIUM.PX} 0` }}>
      <ThumbnailGridDisplay>
        {data?.palettes.map(palette => <PaletteThumbnail key={palette.id} palette={palette} />)}
      </ThumbnailGridDisplay>
    </Box>
  )
}

export default Browse
