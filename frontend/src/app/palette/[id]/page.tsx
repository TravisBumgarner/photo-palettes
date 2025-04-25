'use client'

import { Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { getPaletteById } from '../../../api/palettes/getById'
import { logger } from '../../../services/logging'
import { EModerationStatus } from '../../../types'
import { getContrastColor } from '../../../utils'
import ErrorMessage from '../../sharedComponents/ErrorMessage'
import InfoMessage from '../../sharedComponents/InfoMessage'
import Loading from '../../sharedComponents/Loading'

const PalettePage = () => {
  const params = useParams()
  const paletteId = params.id as string

  const { data, isLoading, error } = useQuery({
    queryKey: ['palette', paletteId],
    queryFn: () => getPaletteById(paletteId),
    retry: false,
  })

  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  if (isLoading || !data) return <Loading />

  if (error) return <ErrorMessage />

  if (!data.success) return <ErrorMessage error={data.error} />

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      {data.palette.moderation_status === EModerationStatus.AWAITING_MODERATION && (
        <InfoMessage info="This palette is pending approval." />
      )}
      <Box sx={{ maxWidth: '1000px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{ maxWidth: '100%', maxHeight: '900px' }}
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${data.palette.image_url}`}
          alt="Palette"
        />
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
          {data.palette.colors.map((color: { id: string; hex: string }) => (
            <Box
              key={color.id}
              style={{
                backgroundColor: color.hex,
                height: '75px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <Typography variant="body1" color={getContrastColor(color.hex)}>
                {color.hex}
              </Typography>
            </Box>
          ))}
        </div>
        <Typography variant="h1">{data.palette.name}</Typography>
      </Box>
    </Box>
  )
}

export default PalettePage
