import type { ColorMix } from '../../types'

export type Details = 'none' | 'hex' | 'rgb' | 'hsl' | 'steps'

export interface PaletteControlsState {
  background: string
  details: Details
  mix: ColorMix
}
