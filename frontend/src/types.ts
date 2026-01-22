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
  hex: z
    .string()
    .length(7)
    .regex(/^#[0-9A-Fa-f]{6}$/),
  r: z.number().min(0).max(255),
  g: z.number().min(0).max(255),
  b: z.number().min(0).max(255),
  name: z.string(),
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

export const zodGeneratedSwatch = z.object({
  color: z
    .string()
    .length(7)
    .regex(/^#[0-9A-Fa-f]{6}$/),
  percentLocation: z.tuple([z.number(), z.number()]),
})

export type TGeneratedSwatch = z.infer<typeof zodGeneratedSwatch>

// For backwards compatibility with lite mode (which returns flat arrays)
export type TGeneratedPalette = TGeneratedSwatch[]

export const zodGeneratedPaletteWithName = z.object({
  name: z.string(),
  swatches: z.array(zodGeneratedSwatch),
})

export type TGeneratedPaletteWithName = z.infer<typeof zodGeneratedPaletteWithName>

export type TPalette = z.infer<typeof zodPalette>

export const SORT_BY = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  FAVORITES_COUNT: 'favorites_count',
  COLOR: 'color',
} as const

export type ESortBy = (typeof SORT_BY)[keyof typeof SORT_BY]

export const zodGeneratePaletteResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    palettes: z.array(zodGeneratedPaletteWithName),
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
  | 'none'
  | 'complementary'
  | 'splitComplementary'
  | 'triadic'
  | 'tetradic'
  | 'analogous'
