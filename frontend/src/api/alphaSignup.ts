import { z } from 'zod'
import config from '../config'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

export const alphaSignup = async (email: string) => {
  const res = await fetch(`${config.apiUrl}/alpha/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
  
  const json = await res.json()
  return zodResponse.parse(json)
}
