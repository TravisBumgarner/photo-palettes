import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    paletteId: z.string(),
    palette: z.array(
      z.object({
        color: z.string(),
        percentLocation: z.tuple([z.number(), z.number()]),
      })
    ),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

export const generatePalette = async (photo: Blob) => {
  const tokenResponse = await getToken()

  if (!tokenResponse) {
    return {
      success: false,
      error: 'No token found',
    } as const
  }

  const formData = new FormData()
  formData.append('photo', photo)
  formData.append('extension', 'jpeg')
  const response = await fetch(`${config.apiUrl}/palettes/generate`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${tokenResponse.token}`,
    },
  })
  const json = await response.json()
  return zodResponse.parse(json)
}
