import { z } from 'zod'
import { getToken } from '../services/supabase/utils'
import { Palette } from '../types'

const zodResponse = z.object({
  success: z.boolean(),
  paletteId: z.string(),
})

export const savePalette = async ({
  palette,
  paletteId,
  name,
}: {
  palette: Palette
  paletteId: string
  name: string
}) => {
  const token = await getToken()

  const formData = new FormData()
  formData.append('palette', JSON.stringify(palette))
  formData.append('paletteId', paletteId)
  formData.append('name', name)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save-palette`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  const json = await response.json()
  return zodResponse.parse(json)
}
