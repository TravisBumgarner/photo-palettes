export const postPhoto = async (photo: File) => {
  const formData = new FormData()
  formData.append('photo', photo)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-palette`, {
    method: 'POST',
    body: formData,
  })
  // TOdo - add types
  return response.json()
}
