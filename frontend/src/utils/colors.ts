// Sorting by Colors is hard. For now I give up.
// I think this is a good start but gee golly - https://www.alanzucconi.com/2015/09/30/colour-sorting/
// I left of by making some color palettes in figma like all yellows, white -> gray, red -> purple. Pick up there.

// import type { TGeneratedPalette } from '../types'
// import { type Sorts } from '../pages/Create/Create.types'

// function hexToRgb(hex: Hex) {
//   const r = parseInt(hex.slice(1, 3), 16)
//   const g = parseInt(hex.slice(3, 5), 16)
//   const b = parseInt(hex.slice(5, 7), 16)
//   return { r, g, b }
// }

// function rgbToHsl({ r, b, g }: { r: number; g: number; b: number }) {
//   r /= 255
//   g /= 255
//   b /= 255

//   const max = Math.max(r, g, b)
//   const min = Math.min(r, g, b)
//   let h = 0,
//     s = 0
//   const l = (max + min) / 2

//   if (max !== min) {
//     const d = max - min
//     s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

//     switch (max) {
//       case r:
//         h = (g - b) / d + (g < b ? 6 : 0)
//         break
//       case g:
//         h = (b - r) / d + 2
//         break
//       case b:
//         h = (r - g) / d + 4
//         break
//     }
//     h /= 6
//   }
//   return { h: h * 360, s: s * 100, l: l * 100 }
// }

// const sortByHue = (generatedPalette: TGeneratedPalette) =>
//   generatedPalette.slice().sort((a, b) => {
//     const { h: hA, s: Sa, l: lA } = rgbToHsl(hexToRgb(a.color))
//     const { h: hB, s: Sb, l: lB } = rgbToHsl(hexToRgb(b.color))

//     if (hA === hB) {
//       if (Sa === Sb) {
//         return lA - lB
//       }
//       return Sa - Sb
//     }

//     return hA - hB
//   })

// const sortBySaturation = (generatedPalette: TGeneratedPalette) =>
//   generatedPalette.slice().sort((a, b) => {
//     const { s: sA, l: lA, h: hA } = rgbToHsl(hexToRgb(a.color))
//     const { s: sB, l: lB, h: hB } = rgbToHsl(hexToRgb(b.color))
//     if (sA === sB) {
//       if (lA === lB) {
//         return hA - hB
//       }
//       return lA - lB
//     }
//     return sA - sB
//   })

// const sortByLightness = (generatedPalette: TGeneratedPalette) =>
//   generatedPalette.slice().sort((a, b) => {
//     const { l: lA, s: sA, h: hA } = rgbToHsl(hexToRgb(a.color))
//     const { l: lB, s: sB, h: hB } = rgbToHsl(hexToRgb(b.color))
//     if (lA === lB) {
//       if (sA === sB) {
//         return hA - hB
//       }
//       return sA - sB
//     }
//     return lA - lB
//   })

// const sortBy = (generatedPalette: TGeneratedPalette, sort: Sorts) => {
//   switch (sort) {
//     case 'hue':
//       return sortByHue(generatedPalette)
//     case 'saturation':
//       return sortBySaturation(generatedPalette)
//     case 'lightness':
//       return sortByLightness(generatedPalette)
//     case 'custom':
//     default:
//       return generatedPalette
//   }
// }

// export default sortBy
