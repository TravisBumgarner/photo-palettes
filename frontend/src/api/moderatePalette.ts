import { z } from 'zod'
import config from '../config'
import { getToken } from '../services/supabase'
import { MODERATION_STATUS, type EModerationStatus } from '../types'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
  }),
])

export const moderatePalette = async ({
  paletteId,
  status,
  shareToSocials = false,
}: {
  paletteId: string
  status: EModerationStatus
  shareToSocials?: boolean
}) => {
  const tokenResponse = await getToken()

  if (!tokenResponse.success)
    return {
      success: false,
      error: 'No token',
    } as const

  const response = await fetch(`${config.apiUrl}/palettes/moderate`, {
    method: 'POST',
    body: JSON.stringify({
      palette_id: paletteId,
      status,
      share_to_socials:
        // No sense sharing a rejected palette.
        status === MODERATION_STATUS.APPROVED ? shareToSocials : false,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenResponse.token}`,
    },
  })

  const data = await response.json()
  return zodResponse.parse(data)
}
