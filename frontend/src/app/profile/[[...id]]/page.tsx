'use client'

import { Tab, Tabs } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { notFound, useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getPaletteListByAppUserId } from '../../../api/palettes/getPaletteListByAppUserId'
import { logger } from '../../../services/logging'
import useGlobalStore from '../../../store'
import { PageTitle, PageWrapper, ThumbnailGridDisplay } from '../../../styles/Shared'
import { SPACING } from '../../../styles/styleConsts'
import { EModerationStatus } from '../../../types'
import { getContrastColor, getUserColorFromUUID } from '../../../utils'
import Loading from '../../sharedComponents/Loading'
import Message from '../../sharedComponents/Message'
import PaletteThumbnail from '../../sharedComponents/PaletteThumbnail'

const TABS = [
  { label: 'Approved', status: EModerationStatus.APPROVED },
  { label: 'Pending', status: EModerationStatus.AWAITING_MODERATION },
  { label: 'Rejected', status: EModerationStatus.REJECTED },
]

const Profile = () => {
  const [tab, setTab] = useState(0)
  const params = useParams()
  const appUserDetails = useGlobalStore(state => state.appUserDetails)
  const isAppAuthenticating = useGlobalStore(state => state.isAppAuthenticating)

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
    if (!profileUserId && !isAppAuthenticating) {
      notFound()
    }
  }, [profileUserId, router, isAppAuthenticating])

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
      <ThumbnailGridDisplay>
        {data.palettes.map(palette => (
          <PaletteThumbnail key={palette.id} palette={palette} />
        ))}
      </ThumbnailGridDisplay>
    )
  }, [data, error, isLoading])

  const isProfileUser = profileUserId === appUserDetails?.id

  const displayName = getUserColorFromUUID(profileUserId)

  return (
    <PageWrapper width="full" minHeight>
      <PageTitle
        text={displayName}
        marginBottom
        sx={{
          fontWeight: 700,
          color: getContrastColor(displayName),
          backgroundColor: displayName,
          alignSelf: 'flex-start',
        }}
      />
      {isProfileUser && (
        <Tabs value={tab} onChange={handleTabChange} sx={{ marginBottom: SPACING.MEDIUM.PX }}>
          {TABS.map((t, i) => (
            <Tab disabled={isLoading} key={i} label={t.label} />
          ))}
        </Tabs>
      )}
      {content}
    </PageWrapper>
  )
}

export default Profile
