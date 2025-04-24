import { z } from 'zod'
import { getToken } from '../services/supabase/utils'
import { TPalette } from '../types'

const zodResponse = z.object({
  success: z.boolean(),
  palette_id: z.string(),
})

export const savePalette = async ({
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
    name: name,
    hex_colors: hexColors,
    palette_id: paletteId,
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save-palette`, {
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
