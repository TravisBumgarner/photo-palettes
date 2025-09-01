import config from '../../config'
import { getToken } from '../../services/supabase'
import { zodGeneratePaletteResponse } from '../../types'

export const generatePalette = async (photo: Blob) => {
  const tokenResponse = await getToken()

  if (!tokenResponse) {
    return {
      success: false,
      message: 'No token found',
    } as const
  }

  const formData = new FormData()
  formData.append('photo', photo)
  const response = await fetch(`${config.apiUrl}/palettes/generate`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${tokenResponse.token}`,
    },
  })
  const json = await response.json()
  return zodGeneratePaletteResponse.parse(json)
}
