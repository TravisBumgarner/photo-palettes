import { z } from 'zod'
import config from '../config'
import { getToken } from '../services/supabase'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

export const deletePalette = async (paletteId: string) => {
  const token = await getToken()
  const response = await fetch(`${config.apiUrl}/palettes/id/${paletteId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()
  return zodResponse.parse(data)
}
