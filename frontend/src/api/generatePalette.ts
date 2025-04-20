import { z } from 'zod'
import { getToken } from '../services/supabase/utils'

const zodResponse = z.object({
  success: z.boolean(),
  palette: z.array(
    z.object({
      color: z.string(),
      percent_location: z.tuple([z.number(), z.number()]),
    })
  ),
})

export const generatePalette = async (photo: File) => {
  const token = await getToken()

  const formData = new FormData()
  formData.append('photo', photo)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-palette`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const json = await response.json()
  return zodResponse.parse(json)
}
