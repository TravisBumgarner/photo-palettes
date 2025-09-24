import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getListAsModerator } from '../api/palettes/getPaletteListAsModerator'
import { PAGINATION_SIZE } from '../consts'
import { logger } from '../services/logging'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import ModerationPanel from '../sharedComponents/ModerationPanel'
import Pagination from '../sharedComponents/Pagination'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import ThumbnailGridDisplay from '../styles/shared/ThumbnailGallery'
import { MODERATION_STATUS, MODERATION_STATUS_LABEL } from '../types'

const STATUS_TABS = [
  MODERATION_STATUS.AWAITING_MODERATION,
  MODERATION_STATUS.APPROVED,
  MODERATION_STATUS.REJECTED,
]

const Moderation = () => {
  const [filterTabIndex, setFilterTabIndex] = useState(0)
  const [page, setPage] = useState(1)
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
    if (!data.success) return <Message message={data.message} color="error" />
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
              <PaletteThumbnail palette={palette} refetch={refetch} />
              <ModerationPanel
                refetch={refetch}
                moderationStatus={STATUS_TABS[filterTabIndex]}
                palette={palette}
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

  return (
    <PageWrapper width="full" minHeight>
      <PageTitle text="Moderation" marginBottom />
      <Tabs
        variant="scrollable"
        value={filterTabIndex}
        onChange={handleTabChange}
      >
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
