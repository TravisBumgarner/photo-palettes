import { Box, Typography } from '@mui/material'
import { BORDER_RADIUS, SPACING } from '../../styles/Theme'
import { TPaletteAndColors } from '../../types'
import { getUserColorFromUUID } from '../../utils'
import Link from './Link'

const PaletteThumbnail = ({ palette }: { palette: TPaletteAndColors }) => {
  return (
    <Link href={`/palette/${palette.id}`} hideUnderline>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: BORDER_RADIUS.ZERO.PX,
          padding: SPACING.SMALL.PX,
          height: '100%',
        }}
        key={palette.id}
      >
        <Box
          component="img"
          src={palette.photoUrl}
          alt={palette.name}
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

        {palette.colors.length > 0 && (
          <Box sx={{ display: 'flex' }}>
            {palette.colors.map(color => (
              <Box
                key={color.id}
                sx={{
                  flexGrow: 1,
                  height: 30,
                  backgroundColor: color.hex,
                }}
              />
            ))}
          </Box>
        )}

        {palette.name && (
          <Typography variant="h6">
            {palette.name} by {palette.appUserId ? getUserColorFromUUID(palette.appUserId) : ''}
          </Typography>
        )}
      </Box>
    </Link>
  )
}

export default PaletteThumbnail
