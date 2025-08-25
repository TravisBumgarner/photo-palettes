import { Box, Typography } from '@mui/material'
// import Image from "next/image";
import { BORDER_RADIUS, SPACING } from '../styles/styleConsts'
import { type TPalette } from '../types'
import { getUserColorFromUUID } from '../utils'
import Link from './Link'
import Favorite from './Favorite'
// import { blurHashToDataURL } from "../utils/blurhashToDataURL";
// import { useMemo } from "react";

const PaletteThumbnail = ({ palette }: { palette: TPalette }) => {
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
          height: '100%',
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

        <img
          src={palette.photoUrl}
          alt={palette.name}
          style={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

        {palette.colors.length > 0 && (
          <Box sx={{ display: 'flex' }}>
            {palette.colors.map((color) => (
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="body1">{palette.name}</Typography>
            <Typography variant="body2">
              By {getUserColorFromUUID(palette.appUserId)}
            </Typography>
          </Box>
          <Favorite
            paletteId={palette.id}
            favorites={palette.favoritesCount}
            hasUserFavorited={false}
          />
        </Box>
      </Box>
    </Link>
  )
}

export default PaletteThumbnail
