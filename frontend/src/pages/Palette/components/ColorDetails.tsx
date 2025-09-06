import Box from '@mui/material/Box'
import { type TSwatch } from '../../../types'
import Swatch from './Swatch'

const ColorDetails = ({ swatch }: { swatch: TSwatch }) => {
  return (
    <Box sx={{ height: '1000px' }}>
      <Swatch swatch={swatch} />
    </Box>
  )
}

export default ColorDetails
