import { getToken } from '../services/supabase/utils'
import { EModerationStatus } from '../types'

export const moderatePalette = async (paletteId: string, status: EModerationStatus) => {
  const token = await getToken()
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/palettes/moderate`, {
    method: 'POST',
    body: JSON.stringify({ palette_id: paletteId, status }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()
  return data
}
