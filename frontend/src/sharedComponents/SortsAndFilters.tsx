import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import Typography from '@mui/material/Typography'
import { useCallback, useState } from 'react'
import { BORDER_RADIUS, SPACING } from '../styles/styleConsts'
import { TAB_HEIGHT } from '../styles/Theme'
import { SORT_BY, type ESortBy } from '../types'
import { getContrastColor } from '../utils/getContrastColor'

const SortsAndFilters = ({
  sortBy,
  handleSortChange,
  color,
}: {
  sortBy: ESortBy
  handleSortChange: (value: ESortBy, color?: string) => void
  color?: string
}) => {
  const [tempColor, setTempColor] = useState(color || '#000000')

  const handleColorChange = useCallback(() => {
    handleSortChange(SORT_BY.COLOR, tempColor)
  }, [handleSortChange, tempColor])

  return (
    <Box
      sx={{
        borderColor: 'divider',
        borderRadius: BORDER_RADIUS.ZERO.PX,
        marginBottom: SPACING.MEDIUM.PX,
        display: 'flex',
        gap: SPACING.TINY.PX,
      }}
    >
      <Tabs
        value={sortBy}
        onChange={(_, value) => handleSortChange(value as ESortBy)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Sort By Tabs"
      >
        <Tab key="newest" value="newest" label="New" />
        <Tab key="favorites_count" value="favorites_count" label="Popular" />
        {color && <Tab key="color" value="color" label="Color" />}
      </Tabs>

      <Box
        position="relative"
        width="70px"
        height={TAB_HEIGHT}
        onClick={() => handleSortChange(SORT_BY.COLOR, tempColor)}
        sx={{
          opacity: sortBy === SORT_BY.COLOR ? 1 : 0.1,
        }}
      >
        <Box
          component="input"
          type="color"
          value={tempColor}
          onClick={handleColorChange}
          onChange={(e) => setTempColor(e.target.value)}
          onBlur={handleColorChange}
          onMouseUp={handleColorChange}
          sx={{
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            border: 'none',
            p: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            display: 'block',
            '&::-webkit-color-swatch-wrapper': { p: 0 },
            '&::-webkit-color-swatch': { border: 'none', borderRadius: 0 },
            '&::-moz-color-swatch': { border: 'none', borderRadius: 0 },
          }}
        />

        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: getContrastColor(tempColor),
            fontWeight: 600,
            pointerEvents: 'none',
          }}
        >
          {tempColor.toUpperCase()}
        </Typography>
      </Box>
    </Box>
  )
}

export default SortsAndFilters
