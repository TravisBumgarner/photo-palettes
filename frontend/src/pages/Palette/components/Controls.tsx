import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled, type SxProps } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { trackEvent } from '../../../services/analytics'
import { FONT_SIZES, SPACING } from '../../../styles/styleConsts'
import {
  BACKGROUND_COLORS,
  COLOR_MIXES,
  COLOR_MIXES_MAP,
  COLOR_MODE_MAP,
  COLOR_MODES,
  TOGGLE_EXPLORATION,
  TOGGLE_EXPLORATION_MAP,
} from '../Palette.consts'
import type { PaletteControlsState } from '../Palette.types'

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
        gap: SPACING.SMALL.PX,
      }}
    >
      <FilterWrapper>
        <Typography sx={labelStyles}>Gradients</Typography>
        <Box sx={{ display: 'flex', gap: SPACING.TINY.PX }}>
          {TOGGLE_EXPLORATION.map((key) => (
            <Button
              sx={{ ...filterButtonsStyles, width: '50%' }}
              size="small"
              variant={
                key === controls.toggleExploration ? 'contained' : 'outlined'
              }
              key={key}
              onClick={() => {
                trackEvent({
                  event: 'palette_filter_button',
                  properties: {
                    toggleExploration: key,
                  },
                })
                setControls((prev) => ({
                  ...prev,
                  toggleExploration: key,
                }))
              }}
            >
              {TOGGLE_EXPLORATION_MAP[key]}
            </Button>
          ))}
        </Box>
      </FilterWrapper>

      <FilterWrapper>
        <Typography sx={labelStyles}>Background</Typography>
        <Box
          sx={{
            display: 'flex',
          }}
        >
          {BACKGROUND_COLORS.map((key) => (
            <Box
              sx={{
                flexGrow: 1,
                height: SHARED_HEIGHT,
                backgroundColor: key,
                cursor: 'pointer',
              }}
              key={key}
              onClick={() => {
                trackEvent({
                  event: 'palette_filter_button',
                  properties: {
                    background: key,
                  },
                })
                setControls((prev) => ({ ...prev, background: key }))
              }}
            />
          ))}
        </Box>
      </FilterWrapper>

      <FilterWrapper>
        <Typography sx={labelStyles}>Color Info</Typography>
        <Box sx={{ display: 'flex', gap: SPACING.TINY.PX, flexWrap: 'wrap' }}>
          {COLOR_MODES.map((key) => (
            <Button
              sx={filterButtonsStyles}
              size="small"
              variant={key === controls.colorMode ? 'contained' : 'outlined'}
              key={key}
              onClick={() => {
                trackEvent({
                  event: 'palette_filter_button',
                  properties: {
                    details: key,
                  },
                })
                setControls((prev) => ({
                  ...prev,
                  colorMode: key,
                  toggleExploration: 'on',
                }))
              }}
            >
              {COLOR_MODE_MAP[key]}
            </Button>
          ))}
        </Box>
      </FilterWrapper>

      <FilterWrapper>
        <Typography sx={labelStyles}>Color Wheel</Typography>
        <Box sx={{ display: 'flex', gap: SPACING.TINY.PX, flexWrap: 'wrap' }}>
          {COLOR_MIXES.map((key) => (
            <Button
              sx={filterButtonsStyles}
              size="small"
              variant={key === controls.mix ? 'contained' : 'outlined'}
              key={key}
              onClick={() => {
                trackEvent({
                  event: 'palette_filter_button',
                  properties: {
                    color_mix: key,
                  },
                })
                setControls((prev) => ({
                  ...prev,
                  mix: key,
                  toggleExploration: 'on',
                }))
              }}
            >
              {COLOR_MIXES_MAP[key]}
            </Button>
          ))}
        </Box>
      </FilterWrapper>
    </Box>
  )
}

const SHARED_HEIGHT = '24px'

const filterButtonsStyles: SxProps = {
  height: SHARED_HEIGHT,
  padding: `0 ${SPACING.SMALL.PX}`,
  minWidth: 'auto',
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
