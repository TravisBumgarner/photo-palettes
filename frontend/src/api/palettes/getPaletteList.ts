import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase'
import { zodPalette, type ESortBy } from '../../types'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    palettes: z.array(zodPalette),
    total: z.number(),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

const getPaletteList = async ({
  size,
  offset,
  appUserId,
  moderationStatus,
  favoritesOnly,
  sortBy,
}: {
  size: number
  offset: number
  appUserId?: string
  moderationStatus?: number
  favoritesOnly?: boolean
  sortBy: ESortBy
}) => {
  const tokenResponse = await getToken()

  if (!tokenResponse) {
    return {
      success: false,
      error: 'No token found',
    } as const
  }

  const params = new URLSearchParams()
  params.append('size', String(size))
  params.append('offset', String(offset))
  params.append('sort_by', sortBy)
  if (appUserId !== undefined) params.append('app_user_id', appUserId)
  if (moderationStatus !== undefined)
    params.append('moderation_status', `${moderationStatus}`)
  if (favoritesOnly !== undefined)
    params.append('favorites_only', `${favoritesOnly}`)

  const response = await fetch(
    `${config.apiUrl}/palettes?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenResponse.token}`,
      },
    }
  )
  const json = await response.json()

  return zodResponse.parse(json)
}

export default getPaletteList
