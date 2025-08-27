import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase'
import { type TGeneratedPalette } from '../../types'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    paletteId: z.string(),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
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
  const tokenResponse = await getToken()

  if (!tokenResponse) {
    return {
      success: false,
      message: 'No token found',
    } as const
  }

  // Extract hex colors from palette
  const hexColors = palette.map((swatch) => swatch.color.toUpperCase())

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
      Authorization: `Bearer ${tokenResponse.token}`,
    },
  })
  const json = await response.json()
  return zodResponse.parse(json)
}
