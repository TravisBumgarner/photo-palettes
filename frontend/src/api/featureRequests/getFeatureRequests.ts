import { z } from 'zod'
import config from '../../config'
import { EFeatureRequestStatus } from '../../types'

const zodSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    featureRequests: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        status: z.nativeEnum(EFeatureRequestStatus),
        votes: z.array(z.string()),
      })
    ),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

const getFeatureRequests = async () => {
  const response = await fetch(`${config.apiUrl}/feature-requests`, {})
  const data = await response.json()

  return zodSchema.parse(data)
}

export default getFeatureRequests
