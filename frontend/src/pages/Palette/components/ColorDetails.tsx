import Box from '@mui/material/Box'
import { SPACING } from '../../../styles/styleConsts'
import { type ColorMix, type TSwatch } from '../../../types'
import { getColorSchemes } from '../../../utils/color'
import type { Details } from '../Palette.types'
import Gradient from './Gradient'
import Swatch from './Swatch'

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
        flexDirection: 'column',
        gap: SPACING.SMALL.PX,
        padding: `${SPACING.MEDIUM.PX} ${SPACING.SMALL.PX}`,
      }}
    >
      <Swatch swatch={swatch} />
      <Box
        sx={{
          display: 'flex',
          gap: SPACING.TINY.PX,
          width: '100%',
          '& > *': {
            flexBasis: `calc(100% / ${schemes.length})`,
          },
        }}
      >
        {schemes.map((hexColor, index) => (
          <Gradient
            key={`${hexColor}-${index}`}
            hexColor={hexColor}
            details={details}
          />
        ))}
      </Box>
    </Box>
  )
}

export default ColorDetails
