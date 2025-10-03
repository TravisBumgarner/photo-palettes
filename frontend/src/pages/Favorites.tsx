import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import getFavoritesList from '../api/favorites/getFavoritesList'
import { PAGINATION_SIZE, ROUTES } from '../consts'
import { trackEvent } from '../services/analytics'
import { logger } from '../services/logging'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import Pagination from '../sharedComponents/Pagination'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'
import SortsAndFilters from '../sharedComponents/SortsAndFilters'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import ThumbnailGridDisplay from '../styles/shared/ThumbnailGallery'
import { type ESortBy, SORT_BY } from '../types'

const Favorites = () => {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<Exclude<ESortBy, 'color'>>(
    SORT_BY.NEWEST
  )

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['favorites', page, sortBy],
    queryFn: () =>
      getFavoritesList({
        size: PAGINATION_SIZE,
        offset: (page - 1) * PAGINATION_SIZE,
        sortBy,
      }),
    retry: false,
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page, sortBy])

  const handleSortChange = useCallback((newSortBy: ESortBy) => {
    if (newSortBy === 'color') {
      // Favorites does not support color for now.
      return
    }

    trackEvent({
      event: 'browse_filter_button',
      properties: { browse_filter: newSortBy, page: 'favorites' },
    })
    setSortBy(newSortBy)
    setPage(1)
  }, [])

  const handlePageChange = useCallback(
    (newPage: number) => {
      trackEvent({
        event: 'browse_navigation',
        properties: {
          browse_filter: sortBy,
          page: 'favorites',
          page_number: newPage,
        },
      })
      setPage(newPage)
    },
    [sortBy]
  )

  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  useEffect(() => {
    if (error) {
      logger.error('Error fetching favorite palettes', error, data?.success)
    }
  }, [error, data?.success])

  const content = useMemo(() => {
    if (isLoading || !data) return <Loading />
    if (error)
      return (
        <Message message="Error fetching favorite palettes" color="error" />
      )
    if (!data.success) return <Message message={data.message} color="error" />
    if (data.palettes.length === 0)
      return <Message message="Go favorite a pallette!" color="info" />

    return (
      <>
        <SortsAndFilters sortBy={sortBy} handleSortChange={handleSortChange} />
        <ThumbnailGridDisplay>
          {data.palettes.map((palette) => (
            <PaletteThumbnail
              key={palette.id}
              palette={palette}
              refetch={refetch}
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
  }, [
    data,
    error,
    isLoading,
    handlePageChange,
    page,
    sortBy,
    refetch,
    handleSortChange,
  ])

  return (
    <PageWrapper width="full" minHeight>
      <PageTitle text={ROUTES.favorites.label} marginBottom />
      {content}
    </PageWrapper>
  )
}

export default Favorites
