import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Color from 'color'
import { useCallback, useMemo, useState } from 'react'
import useMediaQuery from '../../../hooks/UseMediaQuery'
import { trackEvent } from '../../../services/analytics'
import { FONT_SIZES, SPACING } from '../../../styles/styleConsts'
import { getContrastColor } from '../../../utils/getContrastColor'
import { COLOR_MODE_MAP } from '../Palette.consts'
import type { ColorMode } from '../Palette.types'

// There's flickering when just a single column of gradient is selected. Hardcoding makes it super straightforward.
const ROW_HEIGHT = '40px'
const COLUMN_HEIGHT = '60px'
const HEIGHT_LOOKUP: Record<
  `${ColorMode}-${'vertical' | 'horizontal'}`,
  string
> = {
  'hex-vertical': ROW_HEIGHT,
  'hex-horizontal': ROW_HEIGHT,
  'none-vertical': ROW_HEIGHT,
  'none-horizontal': ROW_HEIGHT,
  'rgb-vertical': COLUMN_HEIGHT,
  'rgb-horizontal': ROW_HEIGHT,
  'hsl-vertical': COLUMN_HEIGHT,
  'hsl-horizontal': ROW_HEIGHT,
  'steps-vertical': ROW_HEIGHT,
  'steps-horizontal': ROW_HEIGHT,
}

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
  const [isRecentlyCopied, setIsRecentlyCopied] = useState(false)
  const stepColor = Color(hexColor).lightness(100 - step / 10)

  const colorFormat = useMemo(() => {
    if (colorMode === 'none' || colorMode === 'steps') {
      return COLOR_MODE_MAP['hex']
    }
    return COLOR_MODE_MAP[colorMode]
  }, [colorMode])

  const lookupKey =
    `${colorMode}-${switchVertical ? 'vertical' : 'horizontal'}` as const

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
    setIsRecentlyCopied(true)
    setTimeout(() => setIsRecentlyCopied(false), 2000)
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
        minHeight: HEIGHT_LOOKUP[lookupKey],
        '&:hover .normalText': { display: 'none' },
        '&:hover .hoverText': { display: 'initial' },
      }}
    >
      <Box
        className="hoverText"
        sx={{
          position: 'relative',
          textAlign: 'center',
          display: 'flex',
          flexDirection: switchVertical ? 'column' : 'row',
          gap: switchVertical ? 0 : SPACING.TINY.PX,
        }}
      >
        <Typography
          component="span"
          className="hoverText"
          sx={{
            display: 'none',
            color: getContrastColor(stepColor.hex().toString()),
            fontSize: FONT_SIZES.SMALL.PX,
          }}
        >
          {isRecentlyCopied ? 'Copied!' : `Copy ${colorFormat}`}
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
            {isRecentlyCopied ? 'Copied!' : labelPart}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}

const Gradient = ({
  colorMode,
  hexColor,
  backgroundColor,
}: {
  colorMode: ColorMode
  hexColor: string
  backgroundColor: string
}) => {
  const [isRecentlyCopied, setIsRecentlyCopied] = useState(false)

  const handleCopyToCSSVariables = useCallback(() => {
    setIsRecentlyCopied(true)
    setTimeout(() => setIsRecentlyCopied(false), 2000)
    trackEvent({
      event: 'copy_gradient_css_variables',
      properties: {
        color_mode: colorMode,
      },
    })
    const cssVariables = STEPS.map(
      (step) =>
        `--color-${step}: ${Color(hexColor)
          .lightness(100 - step / 10)
          .hex()
          .toString()};`
    ).join('\n')
    navigator.clipboard.writeText(cssVariables)
  }, [colorMode, hexColor])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: SPACING.TINY.PX,
      }}
    >
      <Button
        sx={{
          color: getContrastColor(backgroundColor),
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
        variant="text"
        onClick={handleCopyToCSSVariables}
      >
        {isRecentlyCopied ? 'Copied!' : `Copy Column`}
      </Button>
      <Box>
        {STEPS.map((step) => (
          <Step
            key={step}
            step={step}
            colorMode={colorMode}
            hexColor={hexColor}
          />
        ))}
      </Box>
    </Box>
  )
}
export default Gradient
