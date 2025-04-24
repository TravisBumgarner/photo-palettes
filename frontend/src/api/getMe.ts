import { z } from 'zod'
import { getToken } from '../services/supabase/utils'

const zodResponse = z.object({
  permission_level: z.number(),
  display_name: z.string(),
  email: z.string(),
  id: z.string(),
})

export const getMe = async () => {
  const token = await getToken()

  if (!token) return null

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const json = await response.json()
  if (json === null) return null

  return zodResponse.parse(json)
}
