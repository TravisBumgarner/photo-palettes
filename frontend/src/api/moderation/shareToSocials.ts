import { z } from 'zod'
import config from '../../config'
import { getToken } from '../../services/supabase'

function sanitizeTags(input: string): string[] {
  return input
    .split(/\s+/) // split on whitespace
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0) // remove empties
    .map((tag) => tag.replace(/^#+/, '')) // strip leading '#'
    .filter((tag) => /^[A-Za-z0-9_]+$/.test(tag)) // only allow alphanum + underscore
}

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
      bluesky_hashtags: sanitizeTags(blueskyHashtags),
      instagram_hashtags: sanitizeTags(instagramHashtags),
      twitter_hashtags: sanitizeTags(twitterHashtags),
      share_to_twitter: shareToTwitter,
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
