import { z } from 'zod'

export const PERMISSION_LEVEL = {
  ANONYMOUS: -1,
  MEMBER: 0,
  MODERATOR: 2,
  ADMIN: 5,
}

export type EPermissionLevel =
  (typeof PERMISSION_LEVEL)[keyof typeof PERMISSION_LEVEL]

export const MODERATION_STATUS = {
  AWAITING_MODERATION: 0,
  APPROVED: 1,
  REJECTED: 2,
}

export const MODERATION_STATUS_LABEL = {
  [MODERATION_STATUS.AWAITING_MODERATION]: 'Pending Approval',
  [MODERATION_STATUS.APPROVED]: 'Approved',
  [MODERATION_STATUS.REJECTED]: 'Rejected',
}

export type EModerationStatus =
  (typeof MODERATION_STATUS)[keyof typeof MODERATION_STATUS]

export type TPaletteColor = {
  id: string
  hex: string
  r: number
  g: number
  b: number
}

export type TPaletteAndColors = {
  appUserId: string
  id: string
  name: string
  photoUrl: string
  colors: TPaletteColor[]
}

export const FEATURE_REQUESTS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
}

export type EFeatureRequestStatus =
  (typeof FEATURE_REQUESTS)[keyof typeof FEATURE_REQUESTS]

export type TFeatureRequest = {
  id: string
  title: string
  description: string
  status: EFeatureRequestStatus
  votes: string[]
}

export const zodSwatch = z.object({
  percentLocation: z.tuple([z.number(), z.number()]),
  id: z.string(),
  hex: z.string(),
  r: z.number(),
  g: z.number(),
  b: z.number(),
})

export type TSwatch = z.infer<typeof zodSwatch>

export const zodPalette = z.object({
  id: z.string(),
  name: z.string(),
  photoUrl: z.string(),
  ogPhotoUrl: z.string(),
  createdAt: z.string(),
  moderationStatus: z.number(),
  appUserId: z.string(),
  blurhash: z.string(),
  aspectRatio: z.number(),
  favoritesCount: z.number(),
  hasUserFavorited: z.boolean(),
  colors: z.array(zodSwatch),
})

export const zodGeneratedPalette = z.object({
  color: z.string(),
  percentLocation: z.tuple([z.number(), z.number()]),
})

export type TGeneratedSwatch = z.infer<typeof zodGeneratedPalette>

export type TGeneratedPalette = TGeneratedSwatch[]

export type TPalette = z.infer<typeof zodPalette>

export const SORT_BY = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  FAVORITES_COUNT: 'favorites_count',
} as const

export const SORT_BY_LABEL = {
  [SORT_BY.NEWEST]: 'Newest',
  [SORT_BY.OLDEST]: 'Oldest',
  [SORT_BY.FAVORITES_COUNT]: 'Favorites Count',
}

export type ESortBy = (typeof SORT_BY)[keyof typeof SORT_BY]

export const zodGeneratePaletteResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    palette: z.array(zodGeneratedPalette),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
  }),
])

export type TGeneratePaletteResponse = z.infer<
  typeof zodGeneratePaletteResponse
>

export type ColorMix =
  | 'complementary'
  | 'splitComplementary'
  | 'triadic'
  | 'tetradic'
  | 'analogous'
