import { z } from 'zod'
import { getToken } from '../../services/supabase/utils'
import { TPalette } from '../../types'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    palette_id: z.string(),
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
  palette: TPalette
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/palettes/create`, {
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
