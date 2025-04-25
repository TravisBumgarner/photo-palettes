import { z } from 'zod'
import { getToken } from '../../services/supabase/utils'
import { EModerationStatus } from '../../types'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
  z.object({
    success: z.literal(true),
    palette: z.object({
      moderation_status: z.nativeEnum(EModerationStatus),
      id: z.string(),
      name: z.string(),
      photo_details: z.string(),
      created_at: z.string(),
      colors: z.array(
        z.object({
          id: z.string(),
          hex: z.string(),
          r: z.number(),
          g: z.number(),
          b: z.number(),
        })
      ),
    }),
  }),
])

export const getPaletteById = async (id: string) => {
  const token = await getToken()

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/palettes/id/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const json = await response.json()

  return zodResponse.parse(json)
}
