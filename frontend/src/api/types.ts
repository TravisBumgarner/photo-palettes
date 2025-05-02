import { z } from 'zod'

export const zodPalette = z.object({
  id: z.string(),
  name: z.string(),
  photoUrl: z.string(),
  ogPhotoUrl: z.string(),
  createdAt: z.string(),
  moderationStatus: z.number(),
  appUserId: z.string(),
  colors: z.array(
    z.object({
      id: z.string(),
      hex: z.string(),
      r: z.number(),
      g: z.number(),
      b: z.number(),
    })
  ),
})
