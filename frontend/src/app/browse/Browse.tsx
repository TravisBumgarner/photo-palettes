'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import getPaletteListModerated from '../../api/palettes/getPaletteListModerated'
import { logger } from '../../services/logging'
import { PageWrapper, ThumbnailGridDisplay } from '../../styles/Shared'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import PaletteThumbnail from '../sharedComponents/PaletteThumbnail'

const Browse = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['palettes'],
    queryFn: getPaletteListModerated,
    retry: false,
  })

  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  if (isLoading || !data) {
    return <Loading />
  }

  if (error) {
    return <Message message="Error fetching palettes" color="error" />
  }

  if (!data.success) {
    return <Message message="Error fetching palettes" color="error" />
  }

  return (
    <PageWrapper width="full" minHeight>
      {!data || data.palettes.length === 0 ? (
        <Message message="Be the first to create a palette!" color="info" />
      ) : (
        <ThumbnailGridDisplay>
          {data?.palettes.map(palette => <PaletteThumbnail key={palette.id} palette={palette} />)}
        </ThumbnailGridDisplay>
      )}
    </PageWrapper>
  )
}

export default Browse
