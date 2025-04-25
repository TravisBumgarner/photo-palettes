import { Box, Typography } from '@mui/material'
import config from '../../config'
import { TPaletteAndColors } from '../../types'

const PaletteThumbnail = ({ palette }: { palette: TPaletteAndColors }) => {
  return (
    <Box
      sx={{
        width: '300px',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
        height: '100%',
      }}
      key={palette.id}
    >
      <Box
        component="img"
        src={`${config.apiUrl}/uploads/${palette.image_url}`}
        alt={palette.name}
        sx={{
          width: '100%',
          height: 200,
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      {palette.name && (
        <Typography variant="h6" sx={{ mb: 1 }}>
          {palette.name}
        </Typography>
      )}
      {palette.colors.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {palette.colors.map(color => (
            <Box
              key={color.id}
              sx={{
                width: 30,
                height: 30,
                backgroundColor: color.hex,
                borderRadius: '50%',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default PaletteThumbnail
