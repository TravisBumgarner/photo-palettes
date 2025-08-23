'use client'

import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import getPaletteList from '../../api/palettes/getPaletteList'
import { logger } from '../../services/logging'
import { PageWrapper, ThumbnailGridDisplay } from '../../styles/Shared'
import Loading from '../_sharedComponents/Loading'
import Message from '../_sharedComponents/Message'
import PaletteThumbnail from '../_sharedComponents/PaletteThumbnail'
import Pagination from '../_sharedComponents/Pagination'
import { PAGINATION_SIZE } from '../../consts'

const Browse = () => {
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['palettes', page],
    queryFn: () => getPaletteList({ size: PAGINATION_SIZE, offset: (page - 1) * PAGINATION_SIZE }),
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

  const content = useMemo(() => {
    if (hasErrored) return <Message message="Error fetching palettes" color="error" />
    if (loading) return <Loading />
    if (noPalettes) return <Message message="No palettes found" color="info" />

    return (
      <>
        <ThumbnailGridDisplay>
          {data?.palettes.map(palette => <PaletteThumbnail key={palette.id} palette={palette} />)}
        </ThumbnailGridDisplay>
        <Pagination total={data.total} onPageChange={handlePageChange} />
      </>
    )
  }, [hasErrored, noPalettes, data, loading, handlePageChange])

  return (
    <PageWrapper width="full" minHeight>
      {content}
    </PageWrapper>
  )
}

export default Browse
