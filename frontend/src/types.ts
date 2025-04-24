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
