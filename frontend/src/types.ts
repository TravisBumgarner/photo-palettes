export type Swatch = {
  color: string
  percent_location: [number, number]
}

export type Palette = Swatch[]

export enum PermissionLevel {
  MEMBER = 0,
  MODERATOR = 2,
  ADMIN = 5,
}

export enum ModerationStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}
