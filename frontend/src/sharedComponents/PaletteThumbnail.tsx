import { Box, Typography, useTheme } from '@mui/material'
// import Image from "next/image";
import { BORDER_RADIUS, SPACING, subtleBackground } from '../styles/styleConsts'
import { type TPalette } from '../types'
import { getUserColorFromUUID } from '../utils'
import Link from './Link'
import Favorite from './Favorite'
import BlurImage from './BlurImage'

const PaletteThumbnail = ({
  palette,
  refetch,
}: {
  palette: TPalette
  refetch: () => void
}) => {
  const theme = useTheme()

  return (
    <Link href={`/palette/${palette.id}`} hideUnderline>
      <Box
        sx={{
          borderRadius: BORDER_RADIUS.ZERO.PX,
          padding: SPACING.SMALL.PX,
          backgroundColor: subtleBackground(theme.palette.mode),
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
          }}
        >
          <BlurImage
            blurHash={palette.blurhash}
            src={palette.photoUrl}
            alt={palette.name}
            aspectRatio={palette.aspectRatio}
          />
        </Box>
        {palette.colors.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: SPACING.TINY.PX,
              marginBottom: SPACING.SMALL.PX,
            }}
          >
            {palette.colors.map((color) => (
              <Box
                key={color.id}
                sx={{
                  flexGrow: 1,
                  height: 15,
                  backgroundColor: color.hex,
                }}
              />
            ))}
          </Box>
        )}
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
