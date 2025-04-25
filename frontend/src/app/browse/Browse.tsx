'use client'

import { Box, Grid, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect } from 'react'
import { getPalettes } from '../../api/palettes/getListModerated'
import { logger } from '../../services/logging'
import ErrorMessage from '../sharedComponents/ErrorMessage'
import Loading from '../sharedComponents/Loading'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'

const Browse = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['palettes'],
    queryFn: getPalettes,
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Browse Palettes
      </Typography>
      <Grid container spacing={3}>
        {data?.palettes.map(palette => (
          <Link href={`/palette/${palette.id}`} key={palette.id}>
            <PaletteThumbnail palette={palette} />
          </Link>
        ))}
      </Grid>
    </Box>
  )
}

export default Browse
