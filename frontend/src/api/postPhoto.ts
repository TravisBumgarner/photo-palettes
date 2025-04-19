import { getToken } from '../services/supabase/utils'

export const postPhoto = async (photo: File) => {
  const token = await getToken()

  const formData = new FormData()
  formData.append('photo', photo)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-palette`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  // TOdo - add types
  return await response.json()
}
