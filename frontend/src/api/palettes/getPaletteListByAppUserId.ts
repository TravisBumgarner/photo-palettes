import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase/utils'
import { EModerationStatus } from '../../types'
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

export const getPaletteListByAppUserId = async (appUserId: string, status: EModerationStatus) => {
  if (!appUserId) {
    return {
      success: false,
      error: 'App user ID is required',
    } as const
  }

  const token = await getToken()

  const response = await fetch(
    `${config.apiUrl}/palettes/app_user_id/${appUserId}?status=${status}`,
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
