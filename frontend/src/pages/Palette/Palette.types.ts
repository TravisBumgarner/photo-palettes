// Controls state types
export type BackgroundColor = 'white' | 'black' | 'transparent'
export type Details = 'none' | 'hex' | 'rgb' | 'hsl' | 'steps'
export type ColorMix = 'complementary' | 'analogous' | 'triadic' | 'tetradic'
export type ShareFormat = 'png' | 'jpg' | 'svg'

export interface PaletteControlsState {
  background: BackgroundColor
  details: Details
  mix: ColorMix
  share: ShareFormat
}
