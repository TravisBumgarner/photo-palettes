import Typography from '@mui/material/Typography'
import type { PaletteControlsState } from '../Palette.types'
import Box from '@mui/material/Box'
import {
  BACKGROUND_COLORS,
  COLOR_MIXES,
  COLOR_MIXES_MAP,
  DETAILS,
  DETAILS_MAP,
} from '../Palette.consts'
import Button from '@mui/material/Button'
import { FONT_SIZES, SPACING } from '../../../styles/styleConsts'
import { styled, type SxProps } from '@mui/material/styles'

interface ControlsProps {
  controls: PaletteControlsState
  setControls: React.Dispatch<React.SetStateAction<PaletteControlsState>>
}

const Controls: React.FC<ControlsProps> = ({ controls, setControls }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.MEDIUM.PX,
        marginTop: SPACING.MEDIUM.PX,
      }}
    >
      <FilterWrapper>
        <Typography sx={labelStyles}>Background</Typography>
        <Box
          sx={{
            display: 'flex',
            gap: SPACING.TINY.PX,
          }}
        >
          {BACKGROUND_COLORS.map((key) => (
            <Box
              sx={{
                flexGrow: 1,
                height: '30px',
                backgroundColor: key,
                cursor: 'pointer',
              }}
              key={key}
              onClick={() =>
                setControls((prev) => ({ ...prev, background: key }))
              }
            />
          ))}
        </Box>
      </FilterWrapper>

      <FilterWrapper>
        <Typography sx={labelStyles}>Details</Typography>
        <Box sx={{ display: 'flex', gap: SPACING.TINY.PX, flexWrap: 'wrap' }}>
          {DETAILS.map((key) => (
            <Button
              size="small"
              variant={key === controls.details ? 'contained' : 'outlined'}
              key={key}
              onClick={() => setControls((prev) => ({ ...prev, details: key }))}
            >
              {DETAILS_MAP[key]}
            </Button>
          ))}
        </Box>
      </FilterWrapper>

      <FilterWrapper>
        <Typography sx={labelStyles}>Color Mix</Typography>
        <Box sx={{ display: 'flex', gap: SPACING.TINY.PX, flexWrap: 'wrap' }}>
          {COLOR_MIXES.map((key) => (
            <Button
              size="small"
              variant={key === controls.mix ? 'contained' : 'outlined'}
              key={key}
              onClick={() => setControls((prev) => ({ ...prev, mix: key }))}
            >
              {COLOR_MIXES_MAP[key]}
            </Button>
          ))}
        </Box>
      </FilterWrapper>
    </Box>
  )
}

const FilterWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: SPACING.TINY.PX,
  flexDirection: 'column',
}))

const labelStyles: SxProps = {
  fontSize: FONT_SIZES.SMALL.PX,
}

export default Controls
