import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { SORT_BY, SORT_BY_LABEL, type ESortBy } from '../types'
import { BORDER_RADIUS, SPACING } from '../styles/styleConsts'

const SortsAndFilters = ({
  sortBy,
  handleSortChange,
}: {
  sortBy: ESortBy
  handleSortChange: (value: ESortBy) => void
}) => {
  return (
    <Box
      sx={{
        borderColor: 'divider',
        borderRadius: BORDER_RADIUS.ZERO.PX,
        marginBottom: SPACING.MEDIUM.PX,
      }}
    >
      <Tabs
        value={sortBy}
        onChange={(_, value) => handleSortChange(value as ESortBy)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Sort By Tabs"
      >
        {Object.values(SORT_BY).map((value) => (
          <Tab
            key={value}
            value={value}
            label={SORT_BY_LABEL[value as keyof typeof SORT_BY_LABEL]}
          />
        ))}
      </Tabs>
    </Box>
  )
}

export default SortsAndFilters
