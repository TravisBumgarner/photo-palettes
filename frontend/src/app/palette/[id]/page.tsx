import { Metadata } from 'next'
import { getPaletteById } from '../../../api/palettes/getPaletteById'
import { logger } from '../../../services/logging'

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata | null> {
  const { id } = await params
  try {
    const response = await getPaletteById(id, true)

    if (!response.success) {
      logger.error('Palette not found', { id })
      return null
    }

    return {
      openGraph: {
        images: [response.palette.ogPhotoUrl],
      },
    }
  } catch {
    return null
  }
}

export default async function PhotoPage() {
  return (
    <main>
      <h1>Photo</h1>
    </main>
  )
}
