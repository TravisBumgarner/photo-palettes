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

export const submitToPublic = async ({
  paletteId,
}: {
  paletteId: string
}) => {
  const tokenResponse = await getToken()

  if (!tokenResponse.success)
    return {
      success: false,
      message: 'No token found',
    } as const

  const response = await fetch(`${config.apiUrl}/palettes/submit_to_public`, {
    method: 'POST',
    body: JSON.stringify({ palette_id: paletteId }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenResponse.token}`,
    },
  })

  const data = await response.json()
  return zodResponse.parse(data)
}
