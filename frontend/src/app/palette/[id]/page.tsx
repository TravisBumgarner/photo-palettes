'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { getPaletteById } from '../../../api/getPaletteById'
import { EModerationStatus } from '../../../types'
const PalettePage = () => {
  const params = useParams()
  const paletteId = params.id as string

  const { data, isLoading, error } = useQuery({
    queryKey: ['palette', paletteId],
    queryFn: () => getPaletteById(paletteId),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {(error as Error).message}</div>
  if (!data?.success) return <div>Error: {data?.error}</div>

  return (
    <div>
      {data.palette.moderation_status === EModerationStatus.AWAITING_MODERATION && (
        <p>This palette is pending approval.</p>
      )}
      <>
        <h1>{data.palette.name}</h1>
        <Image
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
