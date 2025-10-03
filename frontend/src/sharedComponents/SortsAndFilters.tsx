import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import TextField from '@mui/material/TextField'
import { useCallback, useState } from 'react'
import { BORDER_RADIUS, SPACING } from '../styles/styleConsts'
import { TAB_HEIGHT } from '../styles/Theme'
import { SORT_BY, type ESortBy } from '../types'

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
      }}
    >
      <Tabs
        value={sortBy}
        onChange={(_, value) => handleSortChange(value as ESortBy)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Sort By Tabs"
      >
        <Tab key="newest" value="newest" label="Newest" />
        <Tab key="oldest" value="oldest" label="Oldest" />
        <Tab
          key="favorites_count"
          value="favorites_count"
          label="Popular"
        ></Tab>
        {color && <Tab key="color" value="color" label="Color" />}
      </Tabs>

      <TextField
        size="small"
        sx={{
          marginLeft: SPACING.TINY.PX,
          borderRadius: 0,
          border: 0,
          width: '60px',
          '& .MuiInputBase-root': {
            height: TAB_HEIGHT,
            padding: 0,
          },
          '& .MuiInputBase-input': {
            padding: '8px',
            cursor: 'pointer',
            '&::-webkit-color-swatch-wrapper': {
              padding: 0,
            },
            '&::-webkit-color-swatch': {
              border: 'none',
              borderRadius: 0,
            },
            '&::-moz-color-swatch': {
              border: 'none',
              borderRadius: 0,
            },
          },
        }}
        type="color"
        onClick={() => handleSortChange(SORT_BY.COLOR, tempColor)}
        value={tempColor}
        onChange={(e) => setTempColor(e.target.value)}
        onBlur={handleColorChange}
        onMouseUp={handleColorChange}
      />
    </Box>
  )
}

export default SortsAndFilters
