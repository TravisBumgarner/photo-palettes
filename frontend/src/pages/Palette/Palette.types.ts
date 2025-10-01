import type { ColorMix } from '../../types'

export type ColorMode = 'none' | 'hex' | 'rgb' | 'hsl' | 'steps'

export type ToggleExploration = 'on' | 'off'

export interface PaletteControlsState {
  background: string
  colorMode: ColorMode
  mix: ColorMix
  toggleExploration: ToggleExploration
}
