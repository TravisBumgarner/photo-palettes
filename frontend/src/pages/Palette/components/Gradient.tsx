import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Color from 'color'
import { useCallback, useMemo } from 'react'
import useMediaQuery from '../../../hooks/UseMediaQuery'
import { trackEvent } from '../../../services/analytics'
import { FONT_SIZES, SPACING } from '../../../styles/styleConsts'
import { getContrastColor } from '../../../utils/getContrastColor'
import { COLOR_MODE_MAP } from '../Palette.consts'
import type { ColorMode } from '../Palette.types'

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const Step = ({
  step,
  colorMode,
  hexColor,
}: {
  step: number
  colorMode: ColorMode
  hexColor: string
}) => {
  const switchVertical = useMediaQuery('(max-width:700px)')

  const stepColor = Color(hexColor).lightness(100 - step / 10)

  const colorFormat = useMemo(() => {
    if (colorMode === 'none' || colorMode === 'steps') {
      return COLOR_MODE_MAP['hex']
    }
    return COLOR_MODE_MAP[colorMode]
  }, [colorMode])

  const { label, copyLabel } = useMemo<{
    label: string[]
    copyLabel: string
  }>(() => {
    // If a label is null or step, fallback to hex so the user has something to copy.

    const fallbackLabel = Color(stepColor).hex().toString()

    switch (colorMode) {
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
  }, [colorMode, step, stepColor])

  const handleCopyClick = useCallback(() => {
    trackEvent({
      event: 'copy_color_detail',
      properties: {
        detail: colorMode,
        step,
        is_swatch: false,
      },
    })
    navigator.clipboard.writeText(copyLabel)
  }, [copyLabel, colorMode, step])

  return (
    <Box
      key={step}
      onClick={handleCopyClick}
      sx={{
        backgroundColor: stepColor.string(),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        padding: SPACING.SMALL.PX,
        minHeight: '48px',
        '&:hover .normalText': { display: 'none' },
        '&:hover .hoverText': { display: 'initial' },
      }}
    >
      <Box
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
        <Typography
          className="hoverText"
          sx={{
            display: 'none',
            color: getContrastColor(stepColor.hex().toString()),
          }}
        >
          Copy {colorFormat}
        </Typography>
        {label.map((labelPart, index) => (
          <Typography
            component="span"
            className="normalText"
            sx={{
              color: getContrastColor(stepColor.hex().toString()),
              fontSize: FONT_SIZES.SMALL.PX,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            key={`${labelPart}-${index}`}
          >
            {labelPart}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

const Gradient = ({
  colorMode,
  hexColor,
}: {
  colorMode: ColorMode
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
        <Step
          key={step}
          step={step}
          colorMode={colorMode}
          hexColor={hexColor}
        />
      ))}
    </Box>
  )
}
export default Gradient
