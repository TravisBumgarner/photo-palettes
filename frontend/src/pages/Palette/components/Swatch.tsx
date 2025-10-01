import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Color from 'color'
import { useCallback, useMemo, useState } from 'react'
import { trackEvent } from '../../../services/analytics'
import { FONT_SIZES, SPACING } from '../../../styles/styleConsts'
import type { TSwatch } from '../../../types'
import { COLOR_MODE_MAP } from '../Palette.consts'
import type { ColorMode } from '../Palette.types'

const Swatch = ({
  swatch: { hex, name },
  colorMode,
}: {
  swatch: TSwatch
  colorMode: ColorMode
}) => {
  const [isRecentlyCopied, setIsRecentlyCopied] = useState(false)

  const color = Color(hex)
  const primaryBackground = color.hsl()

  const isDark = Color(hex).isDark()

  const secondaryText = Color({
    h: primaryBackground.hue(),
    s: primaryBackground.saturationl(),
    l: primaryBackground.lightness() + (isDark ? 80 : -80),
  })

  const colorFormat = useMemo(() => {
    if (colorMode === 'none' || colorMode === 'steps') {
      return COLOR_MODE_MAP['hex']
    }
    return COLOR_MODE_MAP[colorMode]
  }, [colorMode])

  const copyLabel = useMemo(() => {
    // If a label is null or step, fallback to hex so the user has something to copy.

    switch (colorMode) {
      case 'steps':
      case 'hex':
      case 'none':
        return Color(hex).hex().toString()

      case 'rgb':
        return Color(hex).rgb().string(0)

      case 'hsl':
        return Color(hex).hsl().string(0)
    }
  }, [colorMode, hex])

  const handleCopyClick = useCallback(() => {
    setIsRecentlyCopied(true)
    setTimeout(() => setIsRecentlyCopied(false), 2000)
    trackEvent({
      event: 'copy_color_detail',
      properties: {
        detail: colorMode,
        step: -1,
        is_swatch: true,
      },
    })
    navigator.clipboard.writeText(copyLabel)
  }, [copyLabel, colorMode])

  return (
    <Box>
      <Box
        onClick={handleCopyClick}
        sx={{
          height: '12vh',
          backgroundColor: primaryBackground.toString(),
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          cursor: 'pointer',
          '&:hover .normalText': { display: 'none' },
          '&:hover .hoverText': { display: 'initial' },
        }}
      >
        <Typography
          className="hoverText"
          sx={{
            color: secondaryText.toString(),
            fontSize: FONT_SIZES.MEDIUM.PX,
            fontWeight: 'bold',
            textAlign: 'right',
            padding: SPACING.SMALL.PX,
            display: 'none',
          }}
        >
          {isRecentlyCopied ? 'Copied!' : `Copy ${colorFormat}`}
        </Typography>
        <Typography
          className="normalText"
          sx={{
            color: secondaryText.toString(),
            fontSize: FONT_SIZES.MEDIUM.PX,
            fontWeight: 'bold',
            textAlign: 'right',
            padding: SPACING.SMALL.PX,
          }}
        >
          {isRecentlyCopied ? '' : copyLabel}
          <br />
          {isRecentlyCopied ? 'Copied!' : name}
        </Typography>
      </Box>
    </Box>
  )
}

export default Swatch
