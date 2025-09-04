import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

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
      <FormControl sx={{ width: '200px' }}>
        <InputLabel size="small" id="sort-by-label">
          Sort By
        </InputLabel>
        <Select
          size="small"
          labelId="sort-by-label"
          value={sortBy}
          label="Sort By"
          onChange={(e) => handleSortChange(e.target.value as ESortBy)}
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
