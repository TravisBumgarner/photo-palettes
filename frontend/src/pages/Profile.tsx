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
import { MODERATION_STATUS, MODERATION_STATUS_LABEL } from '../types'
import { getContrastColor, getUserColorFromUUID } from '../utils'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'
import { useNavigate, useParams } from 'react-router-dom'
import Pagination from '../sharedComponents/Pagination'
import { PAGINATION_SIZE } from '../consts'

const STATUS_TABS = [
  MODERATION_STATUS.APPROVED,
  MODERATION_STATUS.AWAITING_MODERATION,
  MODERATION_STATUS.REJECTED,
]

const Profile = () => {
  const [filterTabIndex, setFilterTabIndex] = useState(0)
  const params = useParams()
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)

  const appUserId =
    (Array.isArray(params.id) ? params.id[0] : params.id) ||
    appUserDetails?.id ||
    ''

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', appUserId, filterTabIndex, page],
    queryFn: () =>
      getPaletteListByAppUserId({
        size: PAGINATION_SIZE,
        offset: (page - 1) * PAGINATION_SIZE,
        appUserId,
        status: STATUS_TABS[filterTabIndex],
      }),
    retry: false,
  })
  console.log('ruda', data)
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  useEffect(() => {
    if (!appUserId) {
      navigate('/error404')
    }
  }, [appUserId, navigate])

  const handleTabChange = useCallback(
    (_event: unknown, v: number) => {
      setFilterTabIndex(v)
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
      <>
        <ThumbnailGridDisplay>
          {data.palettes.map((palette) => (
            <PaletteThumbnail key={palette.id} palette={palette} />
          ))}
        </ThumbnailGridDisplay>
        <Pagination total={data.total} onPageChange={handlePageChange} />
      </>
    )
  }, [data, error, isLoading, handlePageChange])

  const isProfileUser = appUserId === appUserDetails?.id

  const displayName = getUserColorFromUUID(appUserId)

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
          value={filterTabIndex}
          onChange={handleTabChange}
          sx={{ marginBottom: SPACING.MEDIUM.PX }}
        >
          {STATUS_TABS.map((key) => (
            <Tab
              disabled={isLoading}
              key={key}
              label={MODERATION_STATUS_LABEL[key]}
            />
          ))}
        </Tabs>
      )}
      {content}
    </PageWrapper>
  )
}

export default Profile
