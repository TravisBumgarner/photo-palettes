import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import getPaletteList from '../api/palettes/getPaletteList'
import { PAGINATION_SIZE } from '../consts'
import { trackEvent } from '../services/analytics'
import { logger } from '../services/logging'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import Pagination from '../sharedComponents/Pagination'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'
import SortsAndFilters from '../sharedComponents/SortsAndFilters'
import PageWrapper from '../styles/shared/PageWrapper'
import ThumbnailGridDisplay from '../styles/shared/ThumbnailGallery'
import { type ESortBy, SORT_BY } from '../types'

const Palettes = ({
  page,
  sortBy,
  handlePageChange,
}: {
  page: number
  sortBy: ESortBy
  handlePageChange: (newPage: number) => void
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['palettes', page, sortBy],
    queryFn: () =>
      getPaletteList({
        size: PAGINATION_SIZE,
        offset: (page - 1) * PAGINATION_SIZE,
        sortBy: sortBy,
      }),
    retry: false,
  })
  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page, sortBy])

  const loading = isLoading || !data
  const hasErrored = !!error || (data && !data.success) || false
  const noPalettes = !data || (data.success && data.palettes.length === 0)

  if (hasErrored) {
    logger.error('Error fetching palettes', error, data?.success)
    return (
      <PageWrapper width="full" minHeight>
        <Message message="Error fetching palettes" color="error" />
      </PageWrapper>
    )
  }

  if (loading) {
    return (
      <PageWrapper width="full" minHeight>
        <Loading />
      </PageWrapper>
    )
  }

  if (noPalettes) {
    return (
      <PageWrapper width="full" minHeight>
        <Message message="No palettes found" color="info" />
      </PageWrapper>
    )
  }

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
        total={data?.success ? data.total : 0}
        currentPage={page}
        onPageChange={handlePageChange}
      />
    </>
  )
}

const Browse = () => {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<ESortBy>(SORT_BY.NEWEST)

  const handlePageChange = useCallback(
    (newPage: number) => {
      trackEvent({
        event: 'browse_navigation',
        properties: {
          browse_filter: sortBy,
          page: 'browse',
          page_number: newPage,
        },
      })
      setPage(newPage)
    },
    [sortBy]
  )

  const handleSortChange = useCallback((newSortBy: ESortBy) => {
    trackEvent({
      event: 'browse_filter_button',
      properties: { browse_filter: newSortBy, page: 'browse' },
    })
    setSortBy(newSortBy)
    setPage(1)
  }, [])

  return (
    <PageWrapper width="full" minHeight>
      <SortsAndFilters sortBy={sortBy} handleSortChange={handleSortChange} />
      <Palettes
        handlePageChange={handlePageChange}
        page={page}
        sortBy={sortBy}
      />
    </PageWrapper>
  )
}

export default Browse
