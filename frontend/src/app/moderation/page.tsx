'use client'

import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { moderatePalette } from '../../api/moderatePalette'
import { getListAsModerator } from '../../api/palettes/getListAsModerator'
import { logger } from '../../services/logging'
import { EModerationStatus, TPaletteAndColors } from '../../types'
import ErrorMessage from '../sharedComponents/ErrorMessage'
import Loading from '../sharedComponents/Loading'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'

const Empty = ({ type }: { type: string }) => (
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
    <Typography variant="h5">No palettes {type}</Typography>
  </Box>
)

const tabs = [
  { label: 'Awaiting Moderation' },
  { label: 'Awaiting Submission' },
  { label: 'Rejected' },
]

const PaletteThumbnailWithModeration = ({
  palette,
  refetch,
}: {
  palette: TPaletteAndColors
  refetch: () => void
}) => {
  const [isFetching, setIsFetching] = useState(false)

  const handleApprove = useCallback(() => {
    setIsFetching(true)
    moderatePalette(palette.id, EModerationStatus.APPROVED)
    refetch()
    setIsFetching(false)
  }, [palette.id, refetch])

  const handleReject = useCallback(() => {
    setIsFetching(true)
    moderatePalette(palette.id, EModerationStatus.REJECTED)
    refetch()
  }, [palette.id, refetch])

  const handleDelete = useCallback(() => {
    // setIsFetching(true)
    // deletePalette(palette.id)
    // refetch()
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PaletteThumbnail palette={palette} />
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        <Button disabled={isFetching} onClick={handleApprove}>
          Approve
        </Button>
        <Button disabled={isFetching} onClick={handleReject}>
          Reject
        </Button>
        <Button disabled={isFetching} onClick={handleDelete}>
          Delete
        </Button>
      </Box>
    </Box>
  )
}

const Moderation = () => {
  const [tab, setTab] = useState(0)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['moderation', tab],
    queryFn: () => getListAsModerator(tab),
    retry: false,
  })

  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  const handleTabChange = useCallback(
    (_event: unknown, v: number) => {
      setTab(v)
      refetch()
    },
    [refetch]
  )

  const content = useMemo(() => {
    if (isLoading || !data) return <Loading />
    if (error) return <ErrorMessage />
    if (!data.success) return <ErrorMessage error={data.error} />
    if (data.palettes.length === 0) return <Empty type={tabs[tab].label} />

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {data.palettes.map(palette => (
          <PaletteThumbnailWithModeration key={palette.id} palette={palette} refetch={refetch} />
        ))}
      </Box>
    )
  }, [data, error, isLoading, refetch, tab])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Moderation
      </Typography>
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        {tabs.map((t, i) => (
          <Tab key={i} label={t.label} />
        ))}
      </Tabs>
      {content}
    </Box>
  )
}

export default Moderation
