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
    // ogPhotoUrl,
  },
  refetch,
}: {
  palette: TPalette
  refetch: () => void
}) => {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            gap: SPACING.SMALL.PX,
          }}
        >
          <PageTitle text={name} />
          {'By'}
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
      <ColorBar height={15} colors={colors.map((c) => c.hex)} />
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
