import Box from '@mui/material/Box'
import { type TSwatch } from '../../../types'
import Swatch from './Swatch'
import type { Details } from '../Palette.types'
import { type ColorMix } from '../../../types'
import Gradient from './Gradient'
import { getColorSchemes } from '../../../utils/color'
import { SPACING } from '../../../styles/styleConsts'

const ColorDetails = ({
  swatch,
  details,
  colorMix,
  index,
}: {
  index: number
  swatch: TSwatch
  details: Details
  colorMix: ColorMix
}) => {
  const schemes = getColorSchemes(swatch.hex)[colorMix]
  return (
    <Box
      id={`color-${index}`}
      sx={{
        display: 'flex',
        gap: SPACING.MEDIUM.PX,
        margin: `0 0 ${SPACING.HUGE.PX} 0`,
        flexGrow: 1,
      }}
    >
      <Swatch swatch={swatch} />
      <Box sx={{ display: 'flex', gap: SPACING.TINY.PX, flexGrow: 1 }}>
        {schemes.map((hexColor) => (
          <Gradient key={hexColor} hexColor={hexColor} details={details} />
        ))}
      </Box>
    </Box>
  )
}

export default ColorDetails
