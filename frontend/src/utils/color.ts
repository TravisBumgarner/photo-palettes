import Color, { type ColorInstance } from 'color'

// Helper to wrap hue around the 0–360 range
const rotateHue = (h: number, deg: number) => (h + deg + 360) % 360

// Complementary: opposite on the wheel
export function complementary(color: ColorInstance) {
  return [color, color.hsl().hue(rotateHue(color.hue(), 180))]
}

// Split Complementary: base + two neighbors of the complement
export function splitComplementary(color: ColorInstance) {
  return [
    color,
    color.hsl().hue(rotateHue(color.hue(), 150)),
    color.hsl().hue(rotateHue(color.hue(), 210)),
  ]
}

// Triadic: three evenly spaced
export function triadic(color: ColorInstance) {
  return [
    color,
    color.hsl().hue(rotateHue(color.hue(), 120)),
    color.hsl().hue(rotateHue(color.hue(), 240)),
  ]
}

// Tetradic (Rectangle): four colors, complements at 90° intervals
export function tetradic(color: ColorInstance) {
  return [
    color,
    color.hsl().hue(rotateHue(color.hue(), 90)),
    color.hsl().hue(rotateHue(color.hue(), 180)),
    color.hsl().hue(rotateHue(color.hue(), 270)),
  ]
}

// Analogous: neighbors on either side
export function analogous(color: ColorInstance) {
  return [
    color.hsl().hue(rotateHue(color.hue(), -30)),
    color,
    color.hsl().hue(rotateHue(color.hue(), 30)),
  ]
}

// Aggregate: get all schemes at once
export function getColorSchemes(hex: string) {
  const base = Color(hex)
  return {
    complementary: complementary(base).map((c) => c.hex()),
    splitComplementary: splitComplementary(base).map((c) => c.hex()),
    triadic: triadic(base).map((c) => c.hex()),
    tetradic: tetradic(base).map((c) => c.hex()),
    analogous: analogous(base).map((c) => c.hex()),
  }
}
