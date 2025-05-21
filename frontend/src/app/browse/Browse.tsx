'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import getPaletteListModerated from '../../api/palettes/getPaletteListModerated'
import { logger } from '../../services/logging'
import { PageWrapper, ThumbnailGridDisplay } from '../../styles/Shared'
import Loading from '../_sharedComponents/Loading'
import Message from '../_sharedComponents/Message'
import PaletteThumbnail from '../_sharedComponents/PaletteThumbnail'

const Browse = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['palettes'],
    queryFn: getPaletteListModerated,
    retry: false,
  })

  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  const loading = isLoading || !data
  const hasErrored = error || (data && !data.success)
  const noPalettes = !data || (data.success && data.palettes.length === 0)

  const content = useMemo(() => {
    if (hasErrored) return <Message message="Error fetching palettes" color="error" />
    if (loading) return <Loading />
    if (noPalettes) return <Message message="No palettes found" color="info" />

    return (
      <ThumbnailGridDisplay>
        {data?.palettes.map(palette => <PaletteThumbnail key={palette.id} palette={palette} />)}
      </ThumbnailGridDisplay>
    )
  }, [hasErrored, noPalettes, data, loading])

  return (
    <PageWrapper width="full" minHeight>
      {content}
    </PageWrapper>
  )
}

export default Browse
