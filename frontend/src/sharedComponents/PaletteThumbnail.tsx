import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { BORDER_RADIUS, SPACING, subtleBackground } from '../styles/styleConsts'
import { type TPalette } from '../types'
import { getUserColorFromUUID } from '../utils/getUserColorFromUUID'
import Link from './Link'
import Favorite from './Favorite'
import BlurImage from './BlurImage'
import ColorBar from './ColorBar'

const PaletteThumbnail = ({
  palette,
  refetch,
}: {
  palette: TPalette
  refetch: () => void
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
        }}
        key={palette.id}
      >
        <Box
          sx={{
            width: '100%',
            aspectRatio: '1/1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            height: '400px',
          }}
        >
          <BlurImage
            blurHash={palette.blurhash}
            src={palette.photoUrl}
            alt={palette.name}
            aspectRatio={palette.aspectRatio}
          />
        </Box>
        <ColorBar colors={palette.colors.map((i) => i.hex)} height={15} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="body1">{palette.name}</Typography>
            <Typography variant="body2">
              {getUserColorFromUUID(palette.appUserId)}
            </Typography>
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
