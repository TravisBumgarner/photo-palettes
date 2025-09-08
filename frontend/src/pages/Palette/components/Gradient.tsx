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
  const { label, copyLabel } = useMemo(() => {
    // If a label is null or step, fallback to hex so the user has something to copy.

    const fallbackLabel = Color(stepColor).hex().toString()

    switch (details) {
      case 'steps':
        return { label: step, copyLabel: fallbackLabel }
      case 'hex': {
        const label = Color(stepColor).hex().toString()
        return {
          label,
          copyLabel: label,
        }
      }
      case 'none':
        return { label: '', copyLabel: fallbackLabel }
      case 'rgb': {
        const label = Color(stepColor).rgb().string(0)
        return { label, copyLabel: label }
      }
      case 'hsl': {
        const label = Color(stepColor).hsl().string(0)
        return { label, copyLabel: label }
      }
    }
  }, [details, step, stepColor])

  return (
    <Box
      key={step}
      onClick={() => {
        navigator.clipboard.writeText(copyLabel)
      }}
      sx={{
        backgroundColor: stepColor.string(),
        flexGrow: 1,
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',

        '&:hover': {
          '& .hoverText::before': {
            content: '"Copy"',
          },

          '& .hoverText': {
            color: getContrastColor(stepColor.hex().toString()),
          },
        },
      }}
    >
      <Typography
        className="hoverText"
        sx={{
          position: 'relative',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          fontSize: FONT_SIZES.SMALL.PX,
          color: getContrastColor(stepColor.hex().toString()),

          '&::before': {
            content: `"${label}"`,
          },
        }}
      />
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
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      {STEPS.map((step) => (
        <Step key={step} step={step} details={details} hexColor={hexColor} />
      ))}
    </Box>
  )
}
export default Gradient
