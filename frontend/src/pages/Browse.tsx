import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import getPaletteList from '../api/palettes/getPaletteList'
import { logger } from '../services/logging'
import PageWrapper from '../styles/shared/PageWrapper'
import ThumbnailGridDisplay from '../styles/shared/ThumbnailGallery'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'
import Pagination from '../sharedComponents/Pagination'
import { PAGINATION_SIZE } from '../consts'
import { type ESortBy, SORT_BY } from '../types'
import SortsAndFilters from '../sharedComponents/SortsAndFilters'

const Browse = () => {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<ESortBy>(SORT_BY.NEWEST)

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

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const loading = isLoading || !data
  const hasErrored = error || (data && !data.success)
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
    <PageWrapper width="full" minHeight>
      <SortsAndFilters sortBy={sortBy} setSortBy={setSortBy} />
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
        total={data.total}
        currentPage={page}
        onPageChange={handlePageChange}
      />
    </PageWrapper>
  )
}

export default Browse
