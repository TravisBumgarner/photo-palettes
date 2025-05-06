'use client'

import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getPaletteListByAppUserId } from '../../../api/palettes/getPaletteListByAppUserId'
import { logger } from '../../../services/logging'
import useGlobalStore from '../../../store'
import { FONT_SIZES, SPACING } from '../../../styles/Theme'
import { EModerationStatus } from '../../../types'
import { getContrastColor } from '../../../utils'
import Loading from '../../sharedComponents/Loading'
import Message from '../../sharedComponents/Message'
import PaletteThumbnail from '../../sharedComponents/PaletteThumbnail'
const TABS = [
  { label: 'Approved', status: EModerationStatus.APPROVED },
  { label: 'Awaiting Moderation', status: EModerationStatus.AWAITING_MODERATION },
  { label: 'Awaiting Submission', status: EModerationStatus.AWAITING_SUBMISSION },
  { label: 'Rejected', status: EModerationStatus.REJECTED },
]

const Profile = () => {
  const [tab, setTab] = useState(0)
  const params = useParams()
  const appUserDetails = useGlobalStore(state => state.appUserDetails)
  const router = useRouter()
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

  useEffect(() => {
    if (!profileUserId) {
      router.push('/')
    }
  }, [profileUserId, router])

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
    if (data.palettes.length === 0) return <Message message="No palettes found" color="info" />

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: SPACING.MEDIUM.PX }}>
        {data.palettes.map(palette => (
          <PaletteThumbnail key={palette.id} palette={palette} />
        ))}
      </Box>
    )
  }, [data, error, isLoading])

  const isProfileUser = profileUserId === appUserDetails?.id

  const displayName = `#${profileUserId.slice(0, 6)}`

  return (
    <Box>
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          fontSize: FONT_SIZES.HUGE_PLUS.PX,
          color: getContrastColor(displayName),
          backgroundColor: displayName,
          display: 'inline-block',
        }}
      >
        <span></span>
        {displayName}
      </Typography>
      {isProfileUser && (
        <Tabs value={tab} onChange={handleTabChange} sx={{ marginBottom: SPACING.MEDIUM.PX }}>
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
