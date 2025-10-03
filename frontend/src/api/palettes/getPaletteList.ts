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
    message: z.string(),
  }),
])

const getPaletteList = async ({
  size,
  offset,
  authorUserId,
  moderationStatus,
  sortBy,
  color,
}: {
  size: number
  offset: number
  authorUserId?: string
  moderationStatus?: number
  sortBy: ESortBy
  color?: string
}) => {
  const tokenResponse = await getToken()

  if (!tokenResponse) {
    return {
      success: false,
      message: 'No token found',
    } as const
  }

  const params = new URLSearchParams()
  params.append('size', String(size))
  params.append('offset', String(offset))
  params.append('sort_by', sortBy)
  if (authorUserId !== undefined) params.append('author_user_id', authorUserId)
  if (moderationStatus !== undefined)
    params.append('moderation_status', `${moderationStatus}`)
  if (color) params.append('color', color)

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
