import Box from '@mui/material/Box'
import BlurImage from '../../../sharedComponents/BlurImage'
import Favorite from '../../../sharedComponents/Favorite'
import { type TPalette } from '../../../types'
import { SPACING } from '../../../styles/styleConsts'
import PageTitle from '../../../styles/shared/PageTitle'
import Link from '../../../sharedComponents/Link'
import ColorBar from '../../../sharedComponents/ColorBar'
// import Share from '../../../sharedComponents/Share'

const Summary = ({
  palette: {
    name,
    blurhash,
    photoUrl,
    aspectRatio,
    appUserId,
    favoritesCount,
    colors,
    hasUserFavorited,
    id,
  },
  refetch,
}: {
  palette: TPalette
  refetch: () => void
}) => {
  return (
    <div>
      <PageTitle text={name} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: SPACING.SMALL.PX,
          alignItems: 'center',
          gap: SPACING.SMALL.PX,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            flexDirection: 'column',
          }}
        >
          <Link href={`/profile/${appUserId}`}>#{appUserId.slice(0, 6)}</Link>
        </Box>

        <Box>
          <Favorite
            refetch={refetch}
            paletteId={id}
            favorites={favoritesCount}
            hasUserFavorited={hasUserFavorited}
          />
        </Box>
      </Box>
      <ColorBar interactive height={15} colors={colors.map((c) => c.hex)} />
      <BlurImage
        alt={`${name} thumbnail`}
        src={photoUrl}
        aspectRatio={aspectRatio}
        blurHash={blurhash}
      />
    </div>
  )
}

export default Summary
