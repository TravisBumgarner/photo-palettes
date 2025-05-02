import { Metadata } from 'next'
import { getPaletteById } from '../../../api/palettes/getPaletteById'
import { logger } from '../../../services/logging'
import { TPalette } from '../../../types'
import PalettePage from './page.client'
type Props = {
  params: {
    id: string
  }
}

let paletteData: TPalette | null = null

export async function generateMetadata({ params }: Props): Promise<Metadata | null> {
  const { id } = await params
  try {
    const response = await getPaletteById(id, true)

    if (!response.success) {
      logger.error('Palette not found', { id })
      return null
    }

    paletteData = response.palette

    return {
      title: `Palette - ${paletteData.name}`,
      openGraph: {
        images: [paletteData.ogPhotoUrl],
        title: `Palette - ${paletteData.name}`,
      },
    }
  } catch {
    return null
  }
}

export default async function PhotoPage({ params }: Props) {
  if (!paletteData) {
    const response = await getPaletteById(params.id, true)
    if (!response.success) return null
    paletteData = response.palette
  }

  return (
    <main>
      <h1>Photo</h1>
      <PalettePage palette={paletteData} />
    </main>
  )
}
