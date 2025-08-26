import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { SORT_BY, SORT_BY_LABEL, type ESortBy } from '../types'
import { BORDER_RADIUS, SPACING } from '../styles/styleConsts'

const SortsAndFilters = ({
  sortBy,
  setSortBy,
}: {
  sortBy: ESortBy
  setSortBy: (value: ESortBy) => void
}) => {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: BORDER_RADIUS.ZERO.PX,
        padding: SPACING.SMALL.PX,
        marginBottom: SPACING.MEDIUM.PX,
      }}
    >
      <FormControl sx={{ width: '200px' }}>
        <InputLabel id="sort-by-label">Sort By</InputLabel>
        <Select
          labelId="sort-by-label"
          value={sortBy}
          label="Sort By"
          onChange={(e) => setSortBy(e.target.value as ESortBy)}
        >
          {Object.values(SORT_BY).map((value) => (
            <MenuItem key={value} value={value}>
              {SORT_BY_LABEL[value as keyof typeof SORT_BY_LABEL]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default SortsAndFilters
