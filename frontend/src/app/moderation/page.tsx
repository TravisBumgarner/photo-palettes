'use client'

import { Box, Button, Grid, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { getModeration } from '../../api/getModeration'
import { moderatePalette } from '../../api/moderatePalette'
import config from '../../config'
import { EModerationStatus, TPaletteAndColors } from '../../types'
import Loading from '../sharedComponents/Loading'

const Palette = ({ palette, refetch }: { palette: TPaletteAndColors; refetch: () => void }) => {
  const handleApprove = useCallback(() => {
    moderatePalette(palette.id, EModerationStatus.APPROVED)
    refetch()
  }, [palette.id, refetch])

  const handleReject = useCallback(() => {
    moderatePalette(palette.id, EModerationStatus.REJECTED)
    refetch()
  }, [palette.id, refetch])

  return (
    <div>
      <div key={palette.id}>
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
      <Button onClick={handleApprove}>Approve</Button>
      <Button onClick={handleReject}>Reject</Button>
    </div>
  )
}

const Moderation = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['moderation'],
    queryFn: getModeration,
  })

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Error loading palettes. Please try again later.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Moderation
      </Typography>
      <Grid container spacing={3}>
        {data?.palettes.map(palette => (
          <Palette refetch={refetch} key={palette.id} palette={palette} />
        ))}
      </Grid>
    </Box>
  )
}

export default Moderation
