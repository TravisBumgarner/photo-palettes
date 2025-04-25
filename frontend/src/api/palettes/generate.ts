import { z } from 'zod'
import { getToken } from '../../services/supabase/utils'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    palette_id: z.string(),
    palette: z.array(
      z.object({
        color: z.string(),
        percent_location: z.tuple([z.number(), z.number()]),
      })
    ),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

export const generatePalette = async (photo: File) => {
  const token = await getToken()

  const formData = new FormData()
  formData.append('photo', photo)
  formData.append('extension', photo.name.split('.').pop() || '')
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/palettes/generate`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const json = await response.json()
  return zodResponse.parse(json)
}
