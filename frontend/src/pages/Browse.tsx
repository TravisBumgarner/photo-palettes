'use client'

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
import { type ESortBy, SORT_BY, SORT_BY_LABEL } from '../types'
import { BORDER_RADIUS, SPACING } from '../styles/styleConsts'
import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material'

const SortsAndFilters = ({
  sortBy,
  setSortBy,
}: {
  sortBy: ESortBy
  setSortBy: (value: ESortBy) => void
}) => {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: BORDER_RADIUS.ZERO.PX,
        padding: SPACING.SMALL.PX,
        marginBottom: SPACING.MEDIUM.PX,
      }}
    >
      <FormControl sx={{ width: '200px' }}>
        <InputLabel id="sort-by-label">Sort By</InputLabel>
        <Select
          labelId="sort-by-label"
          value={sortBy}
          label="Sort By"
          onChange={(e) => setSortBy(e.target.value as ESortBy)}
        >
          {Object.values(SORT_BY).map((value) => (
            <MenuItem key={value} value={value}>
              {SORT_BY_LABEL[value as keyof typeof SORT_BY_LABEL]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

const Browse = () => {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<ESortBy>(SORT_BY.NEWEST)

  const { data, isLoading, error } = useQuery({
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
          <PaletteThumbnail key={palette.id} palette={palette} />
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
