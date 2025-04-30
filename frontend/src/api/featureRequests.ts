import { z } from 'zod'
import config from '../config'
import { getToken } from '../services/supabase/utils'
import { EFeatureRequestStatus } from '../types'

const zodSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    featureRequests: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        status: z.nativeEnum(EFeatureRequestStatus),
      })
    ),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

export const getFeatureRequests = async () => {
  const response = await fetch(`${config.apiUrl}/feature-requests`, {})
  const data = await response.json()

  return zodSchema.parse(data)
}

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

export const addFeatureRequest = async (title: string, description: string) => {
  const token = await getToken()

  if (!token)
    return {
      success: false,
      error: 'No token',
    } as const

  const response = await fetch(`${config.apiUrl}/feature-requests`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  })
  const data = await response.json()
  return zodSchemaForAddFeatureRequest.parse(data)
}
