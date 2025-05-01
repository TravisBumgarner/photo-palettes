import { z } from 'zod'
import { getToken } from '../../services/supabase/utils'
import { zodPalette } from '../types'

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
  const token = await getToken()

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/palettes/id?id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const json = await response.json()

  return zodResponse.parse(json)
}
