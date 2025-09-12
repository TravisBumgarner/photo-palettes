import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import getPaletteList from '../api/palettes/getPaletteList'
import { PAGINATION_SIZE, ROUTES } from '../consts'
import { logger } from '../services/logging'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import Pagination from '../sharedComponents/Pagination'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'
import useGlobalStore from '../store'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import ThumbnailGridDisplay from '../styles/shared/ThumbnailGallery'
import { SPACING } from '../styles/styleConsts'
import { MODERATION_STATUS, MODERATION_STATUS_LABEL, SORT_BY } from '../types'
import { getContrastColor } from '../utils/getContrastColor'
import { getUserColorFromUUID } from '../utils/getUserColorFromUUID'

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

  const authorUserId =
    (Array.isArray(params.id) ? params.id[0] : params.id) ||
    appUserDetails?.id ||
    ''

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', authorUserId, filterTabIndex, page],
    queryFn: () =>
      getPaletteList({
        size: PAGINATION_SIZE,
        offset: (page - 1) * PAGINATION_SIZE,
        authorUserId,
        moderationStatus: STATUS_TABS[filterTabIndex],
        sortBy: SORT_BY.NEWEST,
      }),
    retry: false,
  })

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  useEffect(() => {
    if (!authorUserId) {
      navigate(ROUTES.error404.href)
    }
  }, [authorUserId, navigate])

  const handleTabChange = useCallback((_event: unknown, v: number) => {
    setFilterTabIndex(v)
    setPage(1)
  }, [])

  useEffect(() => {
    if (error) {
      logger.error('Error fetching profile palettes', error, data?.success)
    }
  }, [error, data?.success])

  const content = useMemo(() => {
    if (isLoading || !data) return <Loading />
    if (error)
      return <Message message="Error fetching palettes" color="error" />
    if (!data.success) return <Message message={data.message} color="error" />
    if (data.palettes.length === 0)
      return <Message message="No palettes found" color="info" />

    return (
      <>
        <ThumbnailGridDisplay>
          {data.palettes.map((palette) => (
            <PaletteThumbnail
              refetch={refetch}
              key={palette.id}
              palette={palette}
            />
          ))}
        </ThumbnailGridDisplay>
        <Pagination
          currentPage={page}
          total={data.total}
          onPageChange={handlePageChange}
        />
      </>
    )
  }, [data, error, isLoading, handlePageChange, page, refetch])

  const isProfileUser = authorUserId === appUserDetails?.id

  const displayName = getUserColorFromUUID(authorUserId)

  return (
    <PageWrapper width="full" minHeight>
      <PageTitle
        text={displayName}
        marginBottom
        sx={{
          padding: SPACING.SMALL.PX,
          fontWeight: 700,
          width: '100%',
          color: getContrastColor(displayName),
          backgroundColor: displayName,
          alignSelf: 'flex-start',
        }}
      />
      {isProfileUser && (
        <Tabs
          variant="scrollable"
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
