import { z } from 'zod'

export type TSwatch = {
  color: string
  percentLocation: [number, number]
}

export type TGeneratedPalette = TSwatch[]

export const PERMISSION_LEVEL = {
  VISITOR: -1,
  MEMBER: 0,
  MODERATOR: 2,
  ADMIN: 5,
}

export type EPermissionLevel =
  (typeof PERMISSION_LEVEL)[keyof typeof PERMISSION_LEVEL]

export const MODERATION_STATUS = {
  AWAITING_SUBMISSION: -1,
  AWAITING_MODERATION: 0,
  APPROVED: 1,
  REJECTED: 2,
}

export const MODERATION_STATUS_LABEL = {
  [MODERATION_STATUS.AWAITING_SUBMISSION]: 'Pending Submission',
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

export type TPalette = z.infer<typeof zodPalette>
