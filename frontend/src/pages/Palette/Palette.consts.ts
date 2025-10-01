import { type ColorMix } from '../../types'
import { type ColorMode, type ToggleExploration } from './Palette.types'

export const COLOR_MODES: ColorMode[] = ['none', 'hex', 'rgb', 'hsl', 'steps']

export const COLOR_MODE_MAP: Record<ColorMode, string> = {
  none: 'None',
  hex: 'Hex',
  rgb: 'RGB',
  hsl: 'HSL',
  steps: 'Steps',
}

export const COLOR_MIXES: ColorMix[] = [
  'none',
  'complementary',
  'analogous',
  'triadic',
  'tetradic',
  'splitComplementary',
]

export const COLOR_MIXES_MAP: Record<ColorMix, string> = {
  none: 'None',
  complementary: 'Complementary',
  analogous: 'Analogous',
  triadic: 'Triadic',
  tetradic: 'Tetradic',
  splitComplementary: 'Split Comp.',
}

export const BACKGROUND_COLORS: string[] = [
  '#fff',
  '#ccc',
  '#888',
  '#444',
  '#000',
]

export const TOGGLE_EXPLORATION: ToggleExploration[] = ['on', 'off']

export const TOGGLE_EXPLORATION_MAP: Record<ToggleExploration, string> = {
  on: 'On',
  off: 'Off',
}
