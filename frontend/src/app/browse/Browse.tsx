'use client'

import { Box, Grid, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect } from 'react'
import { getPalettes } from '../../api/palettes/getListModerated'
import config from '../../config'
import { logger } from '../../services/logging'
import ErrorMessage from '../sharedComponents/ErrorMessage'
import Loading from '../sharedComponents/Loading'

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
            <div>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  height: '100%',
                }}
              >
                <Box
                  component="img"
                  src={`${config.apiUrl}/uploads/${palette.image_url}`}
                  alt={palette.name}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {palette.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {palette.colors.map(color => (
                    <Box
                      key={color.id}
                      sx={{
                        width: 30,
                        height: 30,
                        backgroundColor: color.hex,
                        borderRadius: '50%',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </div>
          </Link>
        ))}
      </Grid>
    </Box>
  )
}

export default Browse
