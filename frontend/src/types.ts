export type TSwatch = {
  color: string
  percent_location: [number, number]
}

export type TPalette = TSwatch[]

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
  id: string
  name: string
  photo_url: string
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
