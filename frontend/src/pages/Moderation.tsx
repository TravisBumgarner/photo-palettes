'use client'

import { Box, Tab, Tabs } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getListAsModerator } from '../api/palettes/getPaletteListAsModerator'
import { logger } from '../services/logging'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import ThumbnailGridDisplay from '../styles/shared/ThumbnailGallery'
import {
  MODERATION_STATUS,
  MODERATION_STATUS_LABEL,
  PERMISSION_LEVEL,
} from '../types'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import ModerationPanel from '../sharedComponents/ModerationPanel'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'
import useGlobalStore from '../store'
import { PAGINATION_SIZE } from '../consts'
import Pagination from '../sharedComponents/Pagination'
import { Navigate } from 'react-router-dom'

const STATUS_TABS = [
  MODERATION_STATUS.AWAITING_SUBMISSION,
  MODERATION_STATUS.AWAITING_MODERATION,
  MODERATION_STATUS.APPROVED,
  MODERATION_STATUS.REJECTED,
]

const Moderation = () => {
  const [filterTabIndex, setFilterTabIndex] = useState(0)
  const [page, setPage] = useState(1)
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['moderation', filterTabIndex, page],
    queryFn: () =>
      getListAsModerator({
        status: STATUS_TABS[filterTabIndex],
        size: PAGINATION_SIZE,
        offset: (page - 1) * PAGINATION_SIZE,
      }),
    retry: false,
  })

  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handleTabChange = useCallback(
    (_event: unknown, v: number) => {
      setFilterTabIndex(v)
      setPage(1)
      refetch()
    },
    [refetch]
  )

  useEffect(() => {
    if (error) {
      logger.error('Error fetching moderation palettes', error, data?.success)
    }
  }, [error, data?.success])

  const content = useMemo(() => {
    if (isLoading || !data) return <Loading />
    if (error)
      return <Message message="Error fetching palettes" color="error" />
    if (!data.success) return <Message message={data.error} color="error" />
    if (data.palettes.length === 0)
      return <Message message="No palettes" color="info" />

    return (
      <>
        <ThumbnailGridDisplay>
          {data.palettes.map((palette) => (
            <Box
              key={palette.id}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <PaletteThumbnail palette={palette} />
              <ModerationPanel
                refetch={refetch}
                moderationStatus={STATUS_TABS[filterTabIndex]}
                paletteId={palette.id}
              />
            </Box>
          ))}
        </ThumbnailGridDisplay>
        <Pagination
          currentPage={page}
          total={data.total}
          onPageChange={handlePageChange}
        />
      </>
    )
  }, [data, error, isLoading, refetch, filterTabIndex, handlePageChange, page])

  if (
    !appUserDetails ||
    appUserDetails?.permissionLevel < PERMISSION_LEVEL.MODERATOR
  ) {
    return <Navigate to="/" />
  }

  return (
    <PageWrapper width="full" minHeight>
      <PageTitle text="Moderation" marginBottom />
      <Tabs value={filterTabIndex} onChange={handleTabChange}>
        {STATUS_TABS.map((key) => (
          <Tab
            disabled={isLoading}
            key={key}
            label={MODERATION_STATUS_LABEL[key]}
          />
        ))}
      </Tabs>
      {content}
    </PageWrapper>
  )
}

export default Moderation
