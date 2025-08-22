import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase'
import { zodPalette } from '../../types'

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

const getPaletteListModerated = async ({
  size,
  offset,
}: {
  size: number
  offset: number
}) => {
  const tokenResponse = await getToken()

  if (!tokenResponse) {
    return {
      success: false,
      error: 'No token found',
    } as const
  }

  const response = await fetch(
    `${config.apiUrl}/palettes?size=${size}&offset=${offset}`,
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

export default getPaletteListModerated
