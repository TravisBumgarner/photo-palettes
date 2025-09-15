import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Color from 'color'
import { useMemo } from 'react'
import { FONT_SIZES, SPACING } from '../../../styles/styleConsts'
import type { TSwatch } from '../../../types'
import { DETAILS_MAP } from '../Palette.consts'
import type { Details } from '../Palette.types'

const Swatch = ({
  swatch: { hex },
  details,
}: {
  swatch: TSwatch
  details: Details
}) => {
  const color = Color(hex)
  const primaryBackground = color.hsl()

  const isDark = Color(hex).isDark()

  const secondaryText = Color({
    h: primaryBackground.hue(),
    s: primaryBackground.saturationl(),
    l: primaryBackground.lightness() + (isDark ? 80 : -80),
  })

  const colorFormat = useMemo(() => {
    if (details === 'none' || details === 'steps') {
      return DETAILS_MAP['hex']
    }
    return DETAILS_MAP[details]
  }, [details])

  const copyLabel = useMemo(() => {
    // If a label is null or step, fallback to hex so the user has something to copy.

    switch (details) {
      case 'steps':
      case 'hex':
      case 'none':
        return Color(hex).hex().toString()

      case 'rgb':
        return Color(hex).rgb().string(0)

      case 'hsl':
        return Color(hex).hsl().string(0)
    }
  }, [details, hex])

  return (
    <Box>
      <Box
        onClick={() => {
          navigator.clipboard.writeText(copyLabel)
        }}
        sx={{
          height: '80px',
          backgroundColor: primaryBackground.toString(),
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          cursor: 'pointer',
          '&:hover .normalText': { display: 'none' },
          '&:hover .hoverText': { display: 'initial' },
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
            display: 'none',
          }}
        >
          Copy {colorFormat}
        </Typography>
        <Typography
          className="normalText"
          sx={{
            color: secondaryText.toString(),
            fontSize: FONT_SIZES.MEDIUM.PX,
            fontWeight: 'bold',
            textAlign: 'right',
            padding: SPACING.SMALL.PX,
          }}
        >
          {copyLabel}
        </Typography>
      </Box>
    </Box>
  )
}

export default Swatch
