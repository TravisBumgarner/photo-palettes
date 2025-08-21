'use client'

import { Tab, Tabs } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getPaletteListByAppUserId } from '../api/palettes/getPaletteListByAppUserId'
import { logger } from '../services/logging'
import useGlobalStore from '../store'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import ThumbnailGridDisplay from '../styles/shared/ThumbnailGallery'
import { SPACING } from '../styles/styleConsts'
import { MODERATION_STATUS } from '../types'
import { getContrastColor, getUserColorFromUUID } from '../utils'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'
import { useNavigate, useParams } from 'react-router-dom'

const TABS = [
  { label: 'Approved', status: MODERATION_STATUS.APPROVED },
  { label: 'Pending', status: MODERATION_STATUS.AWAITING_MODERATION },
  { label: 'Rejected', status: MODERATION_STATUS.REJECTED },
]

const Profile = () => {
  const [tab, setTab] = useState(MODERATION_STATUS.APPROVED)
  const params = useParams()
  const navigate = useNavigate()
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)

  const profileUserId =
    (Array.isArray(params.id) ? params.id[0] : params.id) ||
    appUserDetails?.id ||
    ''

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
      navigate('/error404')
    }
  }, [profileUserId, navigate])

  const handleTabChange = useCallback(
    (_event: unknown, v: number) => {
      setTab(v)
      refetch()
    },
    [refetch]
  )

  const content = useMemo(() => {
    if (isLoading || !data) return <Loading />
    if (error)
      return <Message message="Error fetching palettes" color="error" />
    if (!data.success) return <Message message={data.error} color="error" />
    if (data.palettes.length === 0)
      return <Message message="No palettes found" color="info" />

    return (
      <ThumbnailGridDisplay>
        {data.palettes.map((palette) => (
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
        text={`${displayName} (${appUserDetails?.email})`}
        marginBottom
        sx={{
          fontWeight: 700,
          color: getContrastColor(displayName),
          backgroundColor: displayName,
          alignSelf: 'flex-start',
        }}
      />
      {isProfileUser && (
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{ marginBottom: SPACING.MEDIUM.PX }}
        >
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
