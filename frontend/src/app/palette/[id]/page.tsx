'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { getPaletteById } from '../../../api/palettes/getById'
import { logger } from '../../../services/logging'
import { EModerationStatus } from '../../../types'
import ErrorMessage from '../../sharedComponents/ErrorMessage'
import InfoMessage from '../../sharedComponents/InfoMessage'
import Loading from '../../sharedComponents/Loading'

const PalettePage = () => {
  const params = useParams()
  const paletteId = params.id as string

  const { data, isLoading, error } = useQuery({
    queryKey: ['palette', paletteId],
    queryFn: () => getPaletteById(paletteId),
    retry: false,
  })

  useEffect(() => {
    if (error) logger.error(error)
  }, [error])

  if (isLoading || !data) return <Loading />

  if (error) return <ErrorMessage />

  if (!data.success) return <ErrorMessage error={data.error} />

  return (
    <div>
      {data.palette.moderation_status === EModerationStatus.AWAITING_MODERATION && (
        <InfoMessage info="This palette is pending approval." />
      )}
      <>
        <h1>{data.palette.name}</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          style={{ maxWidth: '900px', maxHeight: '900px' }}
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${data.palette.image_url}`}
          alt="Palette"
        />
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
          {data.palette.colors.map((color: { id: string; hex: string }) => (
            <div
              key={color.id}
              style={{
                backgroundColor: color.hex,
                width: '100px',
                height: '100px',
              }}
            >
              {color.hex}
            </div>
          ))}
        </div>
      </>
    </div>
  )
}

export default PalettePage
