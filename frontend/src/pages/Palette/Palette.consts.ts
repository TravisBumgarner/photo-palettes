import { type Details, type ColorMix } from './Palette.types'

export const DETAILS: Details[] = ['none', 'hex', 'rgb', 'hsl', 'steps']

export const DETAILS_MAP: Record<Details, string> = {
  none: 'None',
  hex: 'Hex',
  rgb: 'RGB',
  hsl: 'HSL',
  steps: 'Steps',
}

export const COLOR_MIXES: ColorMix[] = [
  'complementary',
  'analogous',
  'triadic',
  'tetradic',
]

export const COLOR_MIXES_MAP: Record<ColorMix, string> = {
  complementary: 'Complementary',
  analogous: 'Analogous',
  triadic: 'Triadic',
  tetradic: 'Tetradic',
}
