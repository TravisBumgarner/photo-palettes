import Box from '@mui/material/Box'
import type { Details } from '../Palette.types'
import { useMemo } from 'react'
import Color from 'color'
import { getContrastColor } from '../../../utils/getContrastColor'
import Typography from '@mui/material/Typography'
import { FONT_SIZES, SPACING } from '../../../styles/styleConsts'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

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
  const theme = useTheme()
  const switchVertical = useMediaQuery(theme.breakpoints.down('md'))

  const stepColor = Color(hexColor).lightness(100 - step / 10)

  const { label, copyLabel } = useMemo<{
    label: string[]
    copyLabel: string
  }>(() => {
    // If a label is null or step, fallback to hex so the user has something to copy.

    const fallbackLabel = Color(stepColor).hex().toString()

    switch (details) {
      case 'steps':
        return { label: [String(step)], copyLabel: fallbackLabel }
      case 'hex': {
        const label = Color(stepColor).hex().toString()
        return {
          label: [label],
          copyLabel: label,
        }
      }
      case 'none':
        return { label: [''], copyLabel: fallbackLabel }
      case 'rgb': {
        const c = Color(stepColor)
        const r = Math.round(c.red())
        const g = Math.round(c.green())
        const b = Math.round(c.blue())
        return {
          label: [String(r), String(g), String(b)],
          copyLabel: c.rgb().string(0),
        }
      }

      case 'hsl': {
        const c = Color(stepColor)
        const h = Math.round(c.hue())
        const s = Math.round(c.saturationl())
        const l = Math.round(c.lightness())

        return {
          label: [String(h), String(s), String(l)],
          copyLabel: c.hsl().string(0),
        }
      }

      default:
        return { label: [''], copyLabel: fallbackLabel }
    }
  }, [details, step, stepColor])

  return (
    <Tooltip title="Click to copy" placement="left">
      <Box
        key={step}
        onClick={() => {
          navigator.clipboard.writeText(copyLabel)
        }}
        sx={{
          backgroundColor: stepColor.string(),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          padding: SPACING.SMALL.PX,
          minHeight: '48px',
        }}
      >
        <Typography
          className="hoverText"
          sx={{
            position: 'relative',
            textAlign: 'center',
            fontSize: FONT_SIZES.SMALL.PX,
            display: 'flex',
            flexDirection: switchVertical ? 'column' : 'row',
            gap: SPACING.TINY.PX,
          }}
        >
          {label.map((part, index) => (
            <Typography
              sx={{
                color: getContrastColor(stepColor.hex().toString()),
                fontSize: FONT_SIZES.SMALL.PX,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              key={`${part}-${index}`}
            >
              {part}
            </Typography>
          ))}
        </Typography>
      </Box>
    </Tooltip>
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}
    >
      {STEPS.map((step) => (
        <Step key={step} step={step} details={details} hexColor={hexColor} />
      ))}
    </Box>
  )
}
export default Gradient
