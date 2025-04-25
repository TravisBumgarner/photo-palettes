'use client'

import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getPalettes } from '../../api/palettes/getListModerated'
import { logger } from '../../services/logging'
import ErrorMessage from '../sharedComponents/ErrorMessage'
import Link from '../sharedComponents/Link'
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
    <Box sx={{ margin: '20px 0' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        {data?.palettes.map(palette => (
          <Link href={`/palette/${palette.id}`} key={palette.id} hideUnderline>
            <PaletteThumbnail palette={palette} />
          </Link>
        ))}
      </Box>
    </Box>
  )
}

export default Browse
