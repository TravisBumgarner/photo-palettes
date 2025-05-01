'use client'

import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import getPaletteListModerated from '../../api/palettes/getPaletteListModerated'
import { logger } from '../../services/logging'
import ErrorMessage from '../sharedComponents/ErrorMessage'
import Loading from '../sharedComponents/Loading'
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
    return <ErrorMessage />
  }

  if (!data.success) {
    return <ErrorMessage error={data.error} />
  }

  return (
    <Box sx={{ margin: '20px 0' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        {data?.palettes.map(palette => <PaletteThumbnail key={palette.id} palette={palette} />)}
      </Box>
    </Box>
  )
}

export default Browse
