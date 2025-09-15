import Box from '@mui/material/Box'
import Favorite from '../../../sharedComponents/Favorite'
import Link from '../../../sharedComponents/Link'
import PageTitle from '../../../styles/shared/PageTitle'
import { type TPalette } from '../../../types'
import { getUserColorFromUUID } from '../../../utils/getUserColorFromUUID'

const Summary = ({
  palette: { name, appUserId, favoritesCount, hasUserFavorited, id },
  refetch,
}: {
  isMobile: boolean
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
          alignItems: 'center',
        }}
      >
        <Link hideBaseUnderline href={`/profile/${appUserId}`}>
          {getUserColorFromUUID(appUserId)}
        </Link>

        <Box>
          <Favorite
            refetch={refetch}
            paletteId={id}
            favorites={favoritesCount}
            hasUserFavorited={hasUserFavorited}
          />
        </Box>
      </Box>
    </div>
  )
}

export default Summary
