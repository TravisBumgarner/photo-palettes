import Box from '@mui/material/Box'
import type { TSwatch } from '../../../types'
import Typography from '@mui/material/Typography'
import Color from 'color'
import type { SxProps } from '@mui/material/styles'
import { FONT_SIZES, SPACING } from '../../../styles/styleConsts'

const Swatch = ({ swatch: { hex, r, g, b } }: { swatch: TSwatch }) => {
  const color = Color(hex)
  const primaryBackground = color.hsl()

  const isDark = Color(hex).isDark()

  const secondaryBackground = Color({
    h: color.hue(),
    s: color.saturationl(), // l is for hsl
    l: color.lightness() + (isDark ? 5 : -5), // There's probably some improvement here, with an equation that's not const.
    // alpha: 0.8,
  })

  const primaryText = primaryBackground.isDark()
    ? primaryBackground.mix(Color('#ffffff'), 0.8)
    : primaryBackground.mix(Color('#000000'), 0.8)

  // const secondaryText = secondaryBackground.isDark()
  //   ? secondaryBackground.mix(secondaryBackground.lighten(0.9), 0.8)
  //   : secondaryBackground.mix(secondaryBackground.darken(0.9), 0.8)

  const secondaryText = Color({
    h: secondaryBackground.hue(),
    s: secondaryBackground.saturationl(),
    l: secondaryBackground.lightness() + (isDark ? 80 : -80),
  })

  const sharedTextStyles: SxProps = {
    color: `${primaryText.toString()} !important`,
    fontSize: FONT_SIZES.SMALL.PX,
  }

  return (
    <Box
      sx={{
        flexBasis: '120px',
        flexShrink: 0,
        flexGrow: 0,
      }}
    >
      <Box
        sx={{
          padding: SPACING.SMALL.PX,
          aspectRatio: '1/1',
          backgroundColor: primaryBackground.toString(),
        }}
      >
        <Typography sx={sharedTextStyles}>{hex}</Typography>
        <Typography sx={sharedTextStyles}>R {r}</Typography>
        <Typography sx={sharedTextStyles}>G {g}</Typography>
        <Typography sx={sharedTextStyles}>B {b}</Typography>
      </Box>
      <Box sx={{ backgroundColor: secondaryBackground.toString() }}>
        <Typography
          sx={{
            color: secondaryText.toString(),
            fontSize: FONT_SIZES.MEDIUM.PX,
            fontWeight: 'bold',
            textAlign: 'right',
            padding: SPACING.SMALL.PX,
          }}
        >
          {hex}
        </Typography>
      </Box>
    </Box>
  )
}

export default Swatch
