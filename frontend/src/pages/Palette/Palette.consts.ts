import { type Details } from './Palette.types'
import { type ColorMix } from '../../types'

export const DETAILS: Details[] = ['none', 'hex', 'rgb', 'hsl', 'steps']

export const DETAILS_MAP: Record<Details, string> = {
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
  splitComplementary: 'Split Complementary',
}

export const BACKGROUND_COLORS: string[] = [
  '#fff',
  '#ccc',
  '#888',
  '#444',
  '#000',
]
