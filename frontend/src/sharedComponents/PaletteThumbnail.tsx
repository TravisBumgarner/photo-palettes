import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { BORDER_RADIUS, SPACING, subtleBackground } from '../styles/styleConsts'
import { type TPalette } from '../types'
import { getUserColorFromUUID } from '../utils/getUserColorFromUUID'
import BlurImage from './BlurImage'
import ColorBar from './ColorBar'
import Favorite from './Favorite'
import Link from './Link'

const PaletteThumbnail = ({
  palette,
  refetch,
  statusChip,
}: {
  palette: TPalette
  refetch: () => void
  statusChip?: React.ReactNode
}) => {
  const theme = useTheme()

  return (
    <Link href={`/palette/${palette.id}`} hideBaseUnderline hideHoverUnderline>
      <Box
        sx={{
          borderRadius: BORDER_RADIUS.ZERO.PX,
          padding: SPACING.SMALL.PX,
          backgroundColor: subtleBackground(theme.palette.mode),
          '&:hover': {
            backgroundColor: subtleBackground(theme.palette.mode, 'slightly'),
          },
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.MEDIUM.PX,
        }}
        key={palette.id}
      >
        <Box
          sx={{
            aspectRatio: '1/1',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
            }}
          >
            <ColorBar
              colors={palette.colors.map((i) => i.hex)}
              height="100%"
              // Visually nicer? I think. Ensures that every color bar is slightly obstructed. Better visual balance.
              direction={palette.aspectRatio >= 1 ? 'row' : 'column'}
            />
          </Box>
          <Box
            sx={{
              zIndex: 1,
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BlurImage
            includeBorder
              maxDimensions={{ maxHeight: '90%', maxWidth: '90%' }}
              blurHash={palette.blurhash}
              src={palette.photoUrl}
              alt={palette.name}
              aspectRatio={palette.aspectRatio}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="body1">{palette.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: SPACING.TINY.PX }}>
              <Typography variant="body2">
                {getUserColorFromUUID(palette.appUserId)}
              </Typography>
              {statusChip}
            </Box>
          </Box>
          <Favorite
            refetch={refetch}
            paletteId={palette.id}
            favorites={palette.favoritesCount}
            hasUserFavorited={palette.hasUserFavorited}
          />
        </Box>
      </Box>
    </Link>
  )
}

export default PaletteThumbnail
