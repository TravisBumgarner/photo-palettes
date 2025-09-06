import Typography from '@mui/material/Typography'
import type { PaletteControlsState } from '../Palette.types'
import Box from '@mui/material/Box'
import {
  COLOR_MIXES,
  COLOR_MIXES_MAP,
  DETAILS,
  DETAILS_MAP,
} from '../Palette.consts'
import Button from '@mui/material/Button'
import { SPACING } from '../../../styles/styleConsts'
import { styled } from '@mui/material/styles'

interface ControlsProps {
  controls: PaletteControlsState
  setControls: React.Dispatch<React.SetStateAction<PaletteControlsState>>
}

const Controls: React.FC<ControlsProps> = ({ controls, setControls }) => {
  const handleJSON = () => {}

  const handleCSV = () => {}

  const handleCSSVariables = () => {}

  return (
    <div>
      <Box>
        <FilterWrapper>
          <Typography variant="h3">Details</Typography>
          <Box sx={{ display: 'flex', gap: SPACING.TINY.PX, flexWrap: 'wrap' }}>
            {DETAILS.map((key) => (
              <Button
                variant={key === controls.details ? 'contained' : 'outlined'}
                key={key}
                onClick={() =>
                  setControls((prev) => ({ ...prev, details: key }))
                }
              >
                {DETAILS_MAP[key]}
              </Button>
            ))}
          </Box>
        </FilterWrapper>

        <FilterWrapper>
          <Typography variant="h3">Color Mix</Typography>
          <Box sx={{ display: 'flex', gap: SPACING.TINY.PX, flexWrap: 'wrap' }}>
            {COLOR_MIXES.map((key) => (
              <Button
                variant={key === controls.mix ? 'contained' : 'outlined'}
                key={key}
                onClick={() => setControls((prev) => ({ ...prev, mix: key }))}
              >
                {COLOR_MIXES_MAP[key]}
              </Button>
            ))}
          </Box>
        </FilterWrapper>

        <FilterWrapper>
          <Typography variant="h3">Share</Typography>
          <Box sx={{ display: 'flex', gap: SPACING.TINY.PX, flexWrap: 'wrap' }}>
            <Button variant="outlined" key={'json'} onClick={handleJSON}>
              JSON
            </Button>
            <Button variant="outlined" key={'csv'} onClick={handleCSV}>
              CSV
            </Button>
            <Button
              variant="outlined"
              key={'css-variables'}
              onClick={handleCSSVariables}
            >
              CSS Variables
            </Button>
          </Box>
        </FilterWrapper>
      </Box>
    </div>
  )
}

const FilterWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: SPACING.TINY.PX,
  flexWrap: 'wrap',
  margin: `${SPACING.MEDIUM.PX} 0`,
}))

export default Controls
