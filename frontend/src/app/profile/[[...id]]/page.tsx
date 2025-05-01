'use client'

import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getPaletteListByAppUserId } from '../../../api/palettes/getPaletteListByAppUserId'
import { logger } from '../../../services/logging'
import useGlobalStore from '../../../store'
import { EModerationStatus } from '../../../types'
import { getContrastColor } from '../../../utils'
import ErrorMessage from '../../sharedComponents/ErrorMessage'
import Loading from '../../sharedComponents/Loading'
import PaletteThumbnail from '../../sharedComponents/PaletteThumbnail'

const TABS = [
  { label: 'Approved', status: EModerationStatus.APPROVED },
  { label: 'Awaiting Moderation', status: EModerationStatus.AWAITING_MODERATION },
  { label: 'Awaiting Submission', status: EModerationStatus.AWAITING_SUBMISSION },
  { label: 'Rejected', status: EModerationStatus.REJECTED },
]

const Empty = () => (
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
    <Typography variant="h5">No palettes</Typography>
  </Box>
)

const Profile = () => {
  const [tab, setTab] = useState(0)
  const params = useParams()
  const appUserDetails = useGlobalStore(state => state.appUserDetails)

  const profileUserId =
    (Array.isArray(params.id) ? params.id[0] : params.id) || appUserDetails?.id || ''

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', profileUserId, tab],
    queryFn: () => getPaletteListByAppUserId(profileUserId, TABS[tab].status),
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
    if (data.palettes.length === 0) return <Empty />

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {data.palettes.map(palette => (
          <PaletteThumbnail key={palette.id} palette={palette} />
        ))}
      </Box>
    )
  }, [data, error, isLoading])

  const isProfileUser = profileUserId === appUserDetails?.id

  const displayName = `#${profileUserId.slice(0, 6)}`

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h1">
        <span
          style={{
            fontWeight: 700,
            color: getContrastColor(displayName),
            backgroundColor: displayName,
          }}
        >
          {displayName}
        </span>
      </Typography>
      {isProfileUser && (
        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
          {TABS.map((t, i) => (
            <Tab key={i} label={t.label} />
          ))}
        </Tabs>
      )}
      {content}
    </Box>
  )
}

export default Profile
