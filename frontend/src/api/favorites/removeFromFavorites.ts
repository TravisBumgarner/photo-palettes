import { z } from 'zod'
import { getToken } from '../../services/supabase'
import config from '../../config'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
  }),
  z.object({
    success: z.literal(false),
  }),
])

const removeFromFavorites = async ({ paletteId }: { paletteId: string }) => {
  const tokenResponse = await getToken()

  if (!tokenResponse) {
    return {
      success: false,
      error: 'No token found',
    } as const
  }

  const response = await fetch(`${config.apiUrl}/favorites/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenResponse.token}`,
    },
    body: JSON.stringify({ palette_id: paletteId }),
  })

  const result = zodResponse.safeParse(await response.json())

  if (!result.success) {
    throw new Error('Failed to removeFromFavorites')
  }

  return result.data
}

export default removeFromFavorites
