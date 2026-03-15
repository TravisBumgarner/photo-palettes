import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase'
import { type TGeneratedPalette } from '../../types'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    paletteId: z.string(),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
  }),
])

export const createPalette = async ({
  generatedPalette,
  name,
  image,
  shareWithPublic,
}: {
  generatedPalette: TGeneratedPalette
  name: string
  image: Blob
  shareWithPublic: boolean
}) => {
  const tokenResponse = await getToken()

  if (!tokenResponse) {
    return {
      success: false,
      message: 'No token found',
    } as const
  }

  const formData = new FormData()
  formData.append('name', name)
  formData.append(
    'palette',
    JSON.stringify(
      generatedPalette.map((swatch) => {
        return {
          color: swatch.color,
          percent_location: swatch.percentLocation,
        }
      })
    )
  )
  formData.append('image', image)
  formData.append('share_with_public', String(shareWithPublic))

  const response = await fetch(`${config.apiUrl}/palettes/create`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${tokenResponse.token}`,
    },
  })
  const json = await response.json()
  return zodResponse.parse(json)
}
