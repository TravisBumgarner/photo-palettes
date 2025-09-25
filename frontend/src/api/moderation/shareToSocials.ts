import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase'

const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
  }),
])

export const shareToSocials = async ({
  paletteId,
  shareToBluesky,
  shareToInstagram,
  blueskyHashtags,
  instagramHashtags,
  shareToTwitter,
  twitterHashtags,
  caption,
}: {
  paletteId: string
  shareToBluesky: boolean
  shareToInstagram: boolean
  blueskyHashtags: string
  instagramHashtags: string
  shareToTwitter: boolean
  twitterHashtags: string
  caption: string
}) => {
  const tokenResponse = await getToken()

  if (!tokenResponse.success)
    return {
      success: false,
      message: 'No token',
    } as const

  const response = await fetch(`${config.apiUrl}/palettes/share_to_socials`, {
    method: 'POST',
    body: JSON.stringify({
      palette_id: paletteId,
      share_to_bluesky: shareToBluesky,
      share_to_instagram: shareToInstagram,
      bluesky_hashtags: blueskyHashtags.split(' ').filter((tag) => tag),
      instagram_hashtags: instagramHashtags.split(' ').filter((tag) => tag),
      share_to_twitter: shareToTwitter,
      twitter_hashtags: twitterHashtags.split(' ').filter((tag) => tag),
      caption,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenResponse.token}`,
    },
  })

  const data = await response.json()
  return zodResponse.parse(data)
}
