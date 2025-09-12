import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useMutation } from '@tanstack/react-query'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import addToFavorites from '../api/favorites/addToFavorites'
import removeFromFavorites from '../api/favorites/removeFromFavorites'
import useGlobalStore from '../store'
import { PALETTE, SPACING } from '../styles/styleConsts'

interface FavoriteProps {
  paletteId: string
  favorites: number
  hasUserFavorited: boolean
  refetch: () => void
}

const ICON_SIZE = 24

const Favorite = ({
  paletteId,
  favorites,
  hasUserFavorited,
  refetch,
}: FavoriteProps) => {
  const isDark = useTheme().palette.mode === 'dark'
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)
  const color = isDark ? PALETTE.grayscale[200] : PALETTE.grayscale[700]

  const addMutation = useMutation({
    mutationFn: () => addToFavorites({ paletteId }),
    onSettled: () => {
      refetch()
    },
  })

  const removeMutation = useMutation({
    mutationFn: () => removeFromFavorites({ paletteId }),
    onSettled: () => {
      refetch()
    },
  })

  if (!appUserDetails) {
    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: SPACING.SMALL.PX }}
      >
        <Typography
          variant="body1"
          component="span"
          sx={{ textDecoration: 'none' }}
        >
          {favorites}
        </Typography>
        <FaHeart size={ICON_SIZE} color={color} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography
        variant="body1"
        component="span"
        sx={{ textDecoration: 'none' }}
      >
        {favorites}
      </Typography>
      {hasUserFavorited ? (
        <Tooltip title="Remove from favorites">
          <IconButton
            aria-label="unfavorite-palette"
            aria-controls={'unfavorite-palette'}
            onClick={(event) => {
              removeMutation.mutate()
              event.stopPropagation()
              event.preventDefault()
            }}
            disabled={removeMutation.isPending}
          >
            <FaHeart color={color} size={ICON_SIZE} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add to favorites">
          <IconButton
            aria-label="favorite-palette"
            aria-controls={'favorite-palette'}
            onClick={(event) => {
              addMutation.mutate()
              event.stopPropagation()
              event.preventDefault()
            }}
            disabled={addMutation.isPending}
          >
            <FaRegHeart color={color} size={ICON_SIZE} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

export default Favorite
