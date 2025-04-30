import { z } from 'zod'
import { getToken } from '../../services/supabase/utils'
import { zodPalette } from '../types'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    palettes: z.array(zodPalette),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

export const getListByAppUserId = async (appUserId: string) => {
  const token = await getToken()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/palettes/app_user_id/${appUserId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
  const json = await response.json()

  return zodResponse.parse(json)
}
