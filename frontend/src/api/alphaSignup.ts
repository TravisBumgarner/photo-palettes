import config from '../config'

export const alphaSignup = async (email: string) => {
  const res = await fetch(`${config.apiUrl}/alpha-signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
  return res.json()
}
