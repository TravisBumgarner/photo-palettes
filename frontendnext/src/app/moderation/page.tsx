'use client'

import { Box, Tab, Tabs } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getListAsModerator } from '../../api/palettes/getPaletteListAsModerator'
import { logger } from '../../services/logging'
import { PageTitle, PageWrapper, ThumbnailGridDisplay } from '../../styles/Shared'
import { EModerationStatus, EPermissionLevel } from '../../types'
import Loading from '../_sharedComponents/Loading'
import Message from '../_sharedComponents/Message'
import ModerationPanel from '../_sharedComponents/ModerationPanel'
import PaletteThumbnail from '../_sharedComponents/PaletteThumbnail'
import useGlobalStore from '../../store'
import { notFound } from 'next/navigation'
import { PAGINATION_SIZE } from '../../consts'
import Pagination from '../_sharedComponents/Pagination'

const tabs = [
  { label: 'Pending', status: EModerationStatus.AWAITING_MODERATION },
  { label: 'Approved', status: EModerationStatus.APPROVED },
  { label: 'Rejected', status: EModerationStatus.REJECTED },
  { label: 'Submitting', status: EModerationStatus.AWAITING_SUBMISSION },
]

const Moderation = () => {
  const [tab, setTab] = useState(0)
  const [page, setPage] = useState(1)
  const appUserDetails = useGlobalStore(state => state.appUserDetails)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['moderation', tabs[tab].status, page],
    queryFn: () =>
      getListAsModerator({
        status: tabs[tab].status,
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
      setTab(v)
      setPage(1)
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
      <>
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
        <Pagination total={data.total} onPageChange={handlePageChange} />
      </>
    )
  }, [data, error, isLoading, refetch, tab, handlePageChange])

  if (!appUserDetails || appUserDetails?.permissionLevel < EPermissionLevel.MODERATOR) {
    notFound()
  }

  return (
    <PageWrapper width="full" minHeight>
      <PageTitle text="Moderation" marginBottom />
      <Tabs value={tab} onChange={handleTabChange}>
        {tabs.map((t, i) => (
          <Tab disabled={isLoading} key={i} label={t.label} sx={{ padding: 0 }} />
        ))}
      </Tabs>
      {content}
    </PageWrapper>
  )
}

export default Moderation
