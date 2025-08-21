import { z } from 'zod'

export type TSwatch = {
  color: string
  percentLocation: [number, number]
}

export type TGeneratedPalette = TSwatch[]

export enum EPermissionLevel {
  MEMBER = 0,
  MODERATOR = 2,
  ADMIN = 5,
}

export enum EModerationStatus {
  AWAITING_SUBMISSION = -1,
  AWAITING_MODERATION = 0,
  APPROVED = 1,
  REJECTED = 2,
}

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

export enum EFeatureRequestStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

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
