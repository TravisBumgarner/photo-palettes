import { z } from 'zod'
import { getToken } from '../../services/supabase/utils'

const zodResponse = z.object({
  success: z.boolean(),
  palettes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      image_url: z.string(),
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
    })
  ),
})

export const getPalettes = async () => {
  const token = await getToken()

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/palettes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const json = await response.json()
  return zodResponse.parse(json)
}
