import { SPACING } from '../styles/styleConsts'
import Box from '@mui/material/Box'

const ColorBar = ({ colors, height }: { colors: string[]; height: number }) => {
  return (
    colors.length > 0 && (
      <Box
        sx={{
          display: 'flex',
          gap: SPACING.TINY.PX,
          marginBottom: SPACING.SMALL.PX,
        }}
      >
        {colors.map((color, index) => (
          <Box
            key={index}
            sx={{
              flexGrow: 1,
              height,
              backgroundColor: color,
            }}
          />
        ))}
      </Box>
    )
  )
}

export default ColorBar
