import { z } from 'zod'
import { getToken } from '../services/supabase/utils'

const zodResponse = z
  .discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      permission_level: z.number(),
      display_name: z.string(),
      email: z.string(),
      id: z.string(),
    }),
    z.object({
      success: z.literal(false),
      error: z.string(),
    }),
  ])
  .transform(obj =>
    obj.success
      ? {
          success: true,
          permissionLevel: obj.permission_level,
          displayName: obj.display_name,
          email: obj.email,
          id: obj.id,
        }
      : obj
  )

export const getMe = async () => {
  const token = await getToken()

  if (!token)
    return {
      success: false,
      error: 'No token',
    } as const

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const json = await response.json()
  return zodResponse.parse(json)
}
