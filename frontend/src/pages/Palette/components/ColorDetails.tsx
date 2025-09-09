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
        flexDirection: 'column',
        gap: SPACING.MEDIUM.PX,
        padding: `5vh ${SPACING.SMALL.PX} 50vh ${SPACING.SMALL.PX}`, // Main concern here is scrolling to the last color causes the left column to scroll off screen.
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
