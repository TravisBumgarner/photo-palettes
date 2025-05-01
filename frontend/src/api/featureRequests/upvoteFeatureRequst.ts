import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase/utils'

const zodSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    featureRequestId: z.string(),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

const upvoteFeatureRequest = async (featureRequestId: string) => {
  const token = await getToken()

  if (!token)
    return {
      success: false,
      error: 'No token',
    } as const

  const response = await fetch(`${config.apiUrl}/feature-requests/upvote/${featureRequestId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()
  return zodSchema.parse(data)
}

export default upvoteFeatureRequest
