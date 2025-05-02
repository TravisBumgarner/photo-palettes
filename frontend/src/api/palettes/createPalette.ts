import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase/utils'
import { TGeneratedPalette } from '../../types'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    paletteId: z.string(),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

export const createPalette = async ({
  palette,
  paletteId,
  name,
}: {
  palette: TGeneratedPalette
  paletteId: string
  name: string
}) => {
  const token = await getToken()

  // Extract hex colors from palette
  const hexColors = palette.map(swatch => swatch.color)

  // Create the request body
  const requestBody = {
    name,
    hex_colors: hexColors,
    palette_id: paletteId,
  }

  const response = await fetch(`${config.apiUrl}/palettes/create`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const json = await response.json()
  return zodResponse.parse(json)
}
