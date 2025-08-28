import { z } from 'zod'
import config from '../../config'
import { FEATURE_REQUESTS } from '../../types'

const zodSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    featureRequests: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        status: z.enum(FEATURE_REQUESTS),
        votes: z.array(z.string()),
      })
    ),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
  }),
])

const getFeatureRequests = async () => {
  const response = await fetch(`${config.apiUrl}/feature_requests/`, {})
  const data = await response.json()

  return zodSchema.parse(data)
}

export default getFeatureRequests
