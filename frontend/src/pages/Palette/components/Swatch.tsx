import Box from '@mui/material/Box'
import type { TSwatch } from '../../../types'
import Typography from '@mui/material/Typography'
import Color from 'color'
// import type { SxProps } from '@mui/material/styles'
import { FONT_SIZES, SPACING } from '../../../styles/styleConsts'

const Swatch = ({ swatch: { hex } }: { swatch: TSwatch }) => {
  const color = Color(hex)
  const primaryBackground = color.hsl()

  const isDark = Color(hex).isDark()

  // const secondaryBackground = Color({
  //   h: color.hue(),
  //   s: color.saturationl(), // l is for hsl
  //   l: color.lightness() + (isDark ? 5 : -5), // There's probably some improvement here, with an equation that's not const.
  //   // alpha: 0.8,
  // })

  const secondaryText = Color({
    h: primaryBackground.hue(),
    s: primaryBackground.saturationl(),
    l: primaryBackground.lightness() + (isDark ? 80 : -80),
  })

  return (
    <Box>
      <Box
        onClick={() => {
          navigator.clipboard.writeText(hex)
        }}
        sx={{
          height: '80px',
          backgroundColor: primaryBackground.toString(),
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          cursor: 'pointer',
          '&:hover': {
            '& .hoverText::before': {
              content: '"Copy"',
            },
          },
        }}
      >
        <Typography
          className="hoverText"
          sx={{
            color: secondaryText.toString(),
            fontSize: FONT_SIZES.MEDIUM.PX,
            fontWeight: 'bold',
            textAlign: 'right',
            padding: SPACING.SMALL.PX,
            '&::before': {
              content: `"${hex}"`,
            },
          }}
        ></Typography>
      </Box>
    </Box>
  )
}

export default Swatch
