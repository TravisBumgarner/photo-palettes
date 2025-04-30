'use client'

import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getListAsModerator } from '../../api/palettes/getListAsModerator'
import { logger } from '../../services/logging'
import useGlobalStore from '../../store'
import { EModerationStatus } from '../../types'
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
      border: '1px solid black',
      alignItems: 'center',
      borderRadius: '10px',
    }}
  >
    <Typography variant="h5">No palettes {type}</Typography>
  </Box>
)

const tabs = [
  { label: 'Awaiting Moderation', status: EModerationStatus.AWAITING_MODERATION },
  { label: 'Awaiting Submission', status: EModerationStatus.AWAITING_SUBMISSION },
  { label: 'Rejected', status: EModerationStatus.REJECTED },
]

const Moderation = () => {
  const [tab, setTab] = useState(0)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['moderation', tabs[tab].status],
    queryFn: () => getListAsModerator(tabs[tab].status),
    retry: false,
  })
  const appUserDetails = useGlobalStore(state => state.appUserDetails)
  const authId = useGlobalStore(state => state.authId)

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
          <PaletteThumbnail key={palette.id} palette={palette} />
        ))}
      </Box>
    )
  }, [data, error, isLoading, tab])

  if (!appUserDetails || !authId) {
    return <div>Not logged in</div>
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h1">Hello {appUserDetails.email}</Typography>
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
