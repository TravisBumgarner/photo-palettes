'use client'

import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { logger } from '../services/logging'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import ThumbnailGridDisplay from '../styles/shared/ThumbnailGallery'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'
import Pagination from '../sharedComponents/Pagination'
import { PAGINATION_SIZE, ROUTES } from '../consts'
import { type ESortBy, SORT_BY } from '../types'
import SortsAndFilters from '../sharedComponents/SortsAndFilters'
import getFavoritesList from '../api/favorites/getFavoritesList'

const Favorites = () => {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<ESortBy>(SORT_BY.NEWEST)

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

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

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
    if (!data.success) return <Message message={data.error} color="error" />
    if (data.palettes.length === 0)
      return <Message message="No favorite palettes found" color="info" />

    return (
      <>
        <SortsAndFilters sortBy={sortBy} setSortBy={setSortBy} />
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
  }, [data, error, isLoading, handlePageChange, page, sortBy, refetch])

  return (
    <PageWrapper width="full" minHeight>
      <PageTitle text={ROUTES.favorites.label} marginBottom />
      {content}
    </PageWrapper>
  )
}

export default Favorites
