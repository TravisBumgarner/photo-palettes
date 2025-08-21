import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase'

const zodSchemaForAddFeatureRequest = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    featureRequestId: z.string(),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

const addFeatureRequest = async (title: string, description: string) => {
  const tokenResponse = await getToken()

  if (!tokenResponse)
    return {
      success: false,
      error: 'No token',
    } as const

  const response = await fetch(`${config.apiUrl}/feature_requests`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenResponse.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
    }),
  })
  const data = await response.json()
  return zodSchemaForAddFeatureRequest.parse(data)
}

export default addFeatureRequest
