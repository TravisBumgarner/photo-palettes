import { z } from 'zod'
import { getToken } from '../../services/supabase'
import config from '../../config'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
  }),
])

const addToFavorites = async ({ paletteId }: { paletteId: string }) => {
  const tokenResponse = await getToken()

  if (!tokenResponse) {
    return {
      success: false,
      message: 'No token found',
    } as const
  }

  const response = await fetch(`${config.apiUrl}/favorites/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenResponse.token}`,
    },
    body: JSON.stringify({ palette_id: paletteId }),
  })

  const result = zodResponse.safeParse(await response.json())

  if (!result.success) {
    throw new Error('Failed to addToFavorites')
  }

  return result.data
}

export default addToFavorites
