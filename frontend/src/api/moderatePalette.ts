import { z } from 'zod'
import { getToken } from '../services/supabase/utils'
import { EModerationStatus } from '../types'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

export const moderatePalette = async (paletteId: string, status: EModerationStatus) => {
  const token = await getToken()
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/palettes/moderate`, {
    method: 'POST',
    body: JSON.stringify({ palette_id: paletteId, status }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()
  return zodResponse.parse(data)
}
