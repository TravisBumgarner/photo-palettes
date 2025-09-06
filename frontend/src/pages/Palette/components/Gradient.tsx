import Box from '@mui/material/Box'
import type { Details } from '../Palette.types'
import { useMemo } from 'react'
import Color from 'color'
import { getContrastColor } from '../../../utils/getContrastColor'
import Typography from '@mui/material/Typography'
import { FONT_SIZES } from '../../../styles/styleConsts'

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const Step = ({
  step,
  details,
  hexColor,
}: {
  step: number
  details: Details
  hexColor: string
}) => {
  const stepColor = Color(hexColor).lightness(100 - step / 10)

  const label = useMemo(() => {
    if (details == 'steps') return step
    if (details == 'hex') return Color(stepColor).hex().toString()
    if (details == 'none') return ''
    if (details == 'rgb') return Color(stepColor).rgb().string(0)
    if (details == 'hsl') return Color(stepColor).hsl().string(0)
    return null
  }, [details, step, stepColor])

  return (
    <Box
      key={step}
      sx={{
        backgroundColor: stepColor.string(),
        // height: '200px',
        // width: '60px',
        width: '120px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{
          color: getContrastColor(stepColor.hex().toString()),
          // transform: 'rotate(-90deg)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          fontSize: FONT_SIZES.SMALL.PX,
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

const Gradient = ({
  details,
  hexColor,
}: {
  details: Details
  hexColor: string
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {STEPS.map((step) => (
        <Step key={step} step={step} details={details} hexColor={hexColor} />
      ))}
    </Box>
  )
}
export default Gradient
