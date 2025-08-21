import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase'
import { zodPalette } from '../../types'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
  z.object({
    success: z.literal(true),
    palette: zodPalette,
  }),
])

export const getPaletteById = async (id: string) => {
  const tokenResponse = await getToken()

  if (!tokenResponse) {
    return {
      success: false,
      error: 'No token found',
    } as const
  }

  let requestUrl = `${config.apiUrl}/palettes/id/${id}`

  if (!config.isProduction) {
    requestUrl = `http://localhost:8000/palettes/id/${id}`
  }

  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenResponse.token}`,
    },
  })
  const json = await response.json()

  return zodResponse.parse(json)
}
