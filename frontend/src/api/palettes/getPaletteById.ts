import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase/utils'
import { zodPalette } from '../../types'

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

export const getPaletteById = async (id: string, isServerSideRequest: boolean = false) => {
  const token = await getToken()
  // Requests running from NextJS are run on the server, within Docker, and so localhost:8000 is not accessible.
  // This function is called to populate the OG tags.

  let requestUrl = `${config.apiUrl}/palettes/id/${id}`

  if (isServerSideRequest && !config.is_production) {
    requestUrl = `http://backend:8000/palettes/id/${id}`
  }

  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const json = await response.json()

  return zodResponse.parse(json)
}
