import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useMutation } from '@tanstack/react-query'
import { submitToPublic } from '../../../api/palettes/submitToPublic'
import Favorite from '../../../sharedComponents/Favorite'
import Link from '../../../sharedComponents/Link'
import useGlobalStore from '../../../store'
import PageTitle from '../../../styles/shared/PageTitle'
import { MODERATION_STATUS, type TPalette } from '../../../types'
import { getUserColorFromUUID } from '../../../utils/getUserColorFromUUID'

const Summary = ({
  palette: { name, appUserId, favoritesCount, hasUserFavorited, id, moderationStatus },
  refetch,
}: {
  isMobile: boolean
  palette: TPalette
  refetch: () => void
}) => {
  const appUser = useGlobalStore((state) => state.appUser)
  const isOwner = appUser?.id === appUserId
  const isPrivate = moderationStatus === MODERATION_STATUS.PRIVATE

  const submitMutation = useMutation({
    mutationFn: () => submitToPublic({ paletteId: id }),
    onSuccess: (data) => {
      if (data.success) refetch()
    },
  })

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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isOwner && isPrivate && (
            <Button
              variant="outlined"
              size="small"
              disabled={submitMutation.isPending}
              onClick={() => submitMutation.mutate()}
            >
              Share with public
            </Button>
          )}
          {!isPrivate && (
            <Favorite
              refetch={refetch}
              paletteId={id}
              favorites={favoritesCount}
              hasUserFavorited={hasUserFavorited}
            />
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Summary
