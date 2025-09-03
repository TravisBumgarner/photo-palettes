import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
  }),
])

export const backfillOpenGraphImages = async () => {
  const tokenResponse = await getToken()

  if (!tokenResponse.success)
    return {
      success: false,
      error: 'No token',
    } as const

  const response = await fetch(
    `${config.apiUrl}/admin/backfill_open_graph_images`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenResponse.token}`,
      },
    }
  )

  const data = await response.json()
  return zodResponse.parse(data)
}
