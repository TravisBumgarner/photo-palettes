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

export const deleteMe = async () => {
  const tokenResponse = await getToken()

  if (!tokenResponse) {
    return {
      success: false,
      message: 'No token found',
    } as const
  }

  const response = await fetch(`${config.apiUrl}/users/me`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenResponse.token}`,
    },
  })
  const json = await response.json()
  return zodResponse.parse(json)
}
