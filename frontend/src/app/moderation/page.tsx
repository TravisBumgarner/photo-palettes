'use client'

import { Box, Tab, Tabs } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getListAsModerator } from '../../api/palettes/getPaletteListAsModerator'
import { logger } from '../../services/logging'
import { ThumbnailGridDisplay } from '../../styles/Shared'
import { EModerationStatus } from '../../types'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import ModerationPanel from '../sharedComponents/ModerationPanel'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'

const tabs = [
  { label: 'Pending', status: EModerationStatus.AWAITING_MODERATION },
  { label: 'Approved', status: EModerationStatus.APPROVED },
  { label: 'Rejected', status: EModerationStatus.REJECTED },
]

const Moderation = () => {
  const [tab, setTab] = useState(0)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['moderation', tabs[tab].status],
    queryFn: () => getListAsModerator(tabs[tab].status),
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
    if (error) return <Message message="Error fetching palettes" color="error" />
    if (!data.success) return <Message message={data.error} color="error" />
    if (data.palettes.length === 0) return <Message message="No palettes" color="info" />

    return (
      <ThumbnailGridDisplay>
        {data.palettes.map(palette => (
          <Box key={palette.id} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <PaletteThumbnail palette={palette} />
            <ModerationPanel
              refetch={refetch}
              moderationStatus={tabs[tab].status}
              paletteId={palette.id}
            />
          </Box>
        ))}
      </ThumbnailGridDisplay>
    )
  }, [data, error, isLoading, refetch, tab])

  return (
    <Box>
      <Tabs value={tab} onChange={handleTabChange}>
        {tabs.map((t, i) => (
          <Tab key={i} label={t.label} />
        ))}
      </Tabs>
      {content}
    </Box>
  )
}

export default Moderation
