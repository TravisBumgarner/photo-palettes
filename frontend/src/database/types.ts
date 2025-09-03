export type TemporaryPalette = {
  tempId: string
  name: string
  palette: {
    percentLocation: [number, number]
    color: string
  }[]
  image: Blob
}
