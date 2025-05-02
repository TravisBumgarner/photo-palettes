import { Metadata } from 'next'
import { getPaletteById } from '../../../api/palettes/getPaletteById'
import { logger } from '../../../services/logging'
import PalettePage from './page.client'

type Props = {
  params: {
    id: string
  }
}

async function getPalette(id: string) {
  const response = await getPaletteById(id, true)
  if (!response.success) return null
  return response.palette
}

export async function generateMetadata({ params }: Props): Promise<Metadata | null> {
  const { id } = await params
  try {
    const palette = await getPalette(id)
    if (!palette) {
      logger.error('Palette not found', { id })
      return null
    }

    return {
      title: `Palette - ${palette.name}`,
      openGraph: {
        images: [palette.ogPhotoUrl],
        title: `Palette - ${palette.name}`,
      },
    }
  } catch {
    return null
  }
}

export default async function PhotoPage({ params }: Props) {
  const { id } = await params
  const palette = await getPalette(id)
  if (!palette) return null

  return (
    <main>
      <h1>Photo</h1>
      <PalettePage palette={palette} />
    </main>
  )
}
