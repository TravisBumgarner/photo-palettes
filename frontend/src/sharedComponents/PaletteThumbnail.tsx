import { Box, Typography } from '@mui/material'
// import Image from "next/image";
import { BORDER_RADIUS, SPACING } from '../styles/styleConsts'
import { type TPalette } from '../types'
import { getUserColorFromUUID } from '../utils'
import Link from './Link'
import Favorite from './Favorite'
// import { blurHashToDataURL } from "../utils/blurhashToDataURL";
// import { useMemo } from "react";

const PaletteThumbnail = ({
  palette,
  refetch,
}: {
  palette: TPalette
  refetch: () => void
}) => {
  // const blurDataURL = useMemo(
  //   () => blurHashToDataURL(palette.blurhash),
  //   [palette.blurhash]
  // );

  return (
    <Link href={`/palette/${palette.id}`} hideUnderline>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: BORDER_RADIUS.ZERO.PX,
          padding: SPACING.SMALL.PX,
        }}
        key={palette.id}
      >
        {/* <Image
          placeholder="blur"
          width={1200}
          height={1200}
          blurDataURL={blurDataURL}
          src={palette.photoUrl}
          alt={palette.name}
          style={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            objectPosition: "center",
          }}
        /> */}
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
          <img
            src={palette.photoUrl}
            alt={palette.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              aspectRatio: palette.aspectRatio,
              border: `5px solid white`,
            }}
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
