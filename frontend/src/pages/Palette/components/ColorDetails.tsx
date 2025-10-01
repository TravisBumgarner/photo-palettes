import Box from '@mui/material/Box'
import { SPACING } from '../../../styles/styleConsts'
import { type ColorMix, type TSwatch } from '../../../types'
import { getColorSchemes } from '../../../utils/color'
import type { ColorMode, ToggleExploration } from '../Palette.types'
import Gradient from './Gradient'
import Swatch from './Swatch'

const ColorDetails = ({
  swatch,
  colorMode,
  colorMix,
  index,
  toggleExploration,
  backgroundColor,
}: {
  index: number
  swatch: TSwatch
  colorMode: ColorMode
  colorMix: ColorMix
  backgroundColor: string
  toggleExploration: ToggleExploration
}) => {
  const schemes = getColorSchemes(swatch.hex)[colorMix]
  return (
    <Box
      id={`color-${index}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ...(toggleExploration === 'on'
          ? {
              gap: SPACING.SMALL.PX,
              padding: `${SPACING.MEDIUM.PX} 0`,
            }
          : {}),
      }}
    >
      <Swatch swatch={swatch} colorMode={colorMode} />
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
        {toggleExploration === 'on' &&
          schemes.map((hexColor, index) => (
            <Gradient
              key={`${hexColor}-${index}`}
              hexColor={hexColor}
              colorMode={colorMode}
              backgroundColor={backgroundColor}
            />
          ))}
      </Box>
    </Box>
  )
}

export default ColorDetails
