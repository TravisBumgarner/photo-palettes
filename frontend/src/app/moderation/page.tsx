'use client'

import { Box, Button, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { moderatePalette } from '../../api/moderatePalette'
import { getModeration } from '../../api/palettes/getListUnmoderated'
import config from '../../config'
import { logger } from '../../services/logging'
import { EModerationStatus, TPaletteAndColors } from '../../types'
import ErrorMessage from '../sharedComponents/ErrorMessage'
import Loading from '../sharedComponents/Loading'

const Empty = ({ type }: { type: 'awaiting-moderation' | 'awaiting-submission' }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid black',
        borderRadius: '10px',
      }}
    >
      <Typography variant="h5">
        {type === 'awaiting-moderation'
          ? 'No palettes awaiting moderation'
          : 'No palettes awaiting submission'}
      </Typography>
    </Box>
  )
}

const Palette = ({
  palette,
  refetch,
  readonly,
}: {
  palette: TPaletteAndColors
  refetch: () => void
  readonly: boolean
}) => {
  const handleApprove = useCallback(() => {
    moderatePalette(palette.id, EModerationStatus.APPROVED)
    refetch()
  }, [palette.id, refetch])

  const handleReject = useCallback(() => {
    moderatePalette(palette.id, EModerationStatus.REJECTED)
    refetch()
  }, [palette.id, refetch])

  const handleDelete = useCallback(() => {
    // deletePalette(palette.id)
    // refetch()
  }, [])

  return (
    <Box
      sx={{
        width: '300px',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
        height: '100%',
      }}
      key={palette.id}
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
      <Button disabled={readonly} onClick={handleApprove}>
        Approve
      </Button>
      <Button disabled={readonly} onClick={handleReject}>
        Reject
      </Button>
      <Button disabled={readonly} onClick={handleDelete}>
        Delete
      </Button>
    </Box>
  )
}

const Moderation = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['moderation'],
    queryFn: getModeration,
    retry: false,
  })

  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  const awaitingModeration = useMemo(() => {
    if (!data?.success) return []

    const filteredPalettes = data.palettes.filter(
      palette => palette.moderation_status === EModerationStatus.AWAITING_MODERATION
    )
    return filteredPalettes || []
  }, [data])

  const awaitingSubmission = useMemo(() => {
    if (!data?.success) return []

    const filteredPalettes = data.palettes.filter(
      palette => palette.moderation_status === EModerationStatus.AWAITING_SUBMISSION
    )
    return filteredPalettes || []
  }, [data])

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
        Moderation
      </Typography>
      <Box>
        <Typography variant="h5">Awaiting Moderation</Typography>
        {awaitingModeration.length > 0 ? (
          awaitingModeration.map(palette => (
            <Palette readonly={false} refetch={refetch} key={palette.id} palette={palette} />
          ))
        ) : (
          <Empty type="awaiting-moderation" />
        )}
      </Box>
      <Box>
        <Typography variant="h5">Awaiting Submission</Typography>
        {awaitingSubmission.length > 0 ? (
          awaitingSubmission.map(palette => (
            <Palette readonly refetch={refetch} key={palette.id} palette={palette} />
          ))
        ) : (
          <Empty type="awaiting-submission" />
        )}
      </Box>
    </Box>
  )
}

export default Moderation
