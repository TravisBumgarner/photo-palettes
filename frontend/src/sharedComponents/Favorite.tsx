import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useMutation } from '@tanstack/react-query'
import addToFavorites from '../api/favorites/addToFavorites'
import removeFromFavorites from '../api/favorites/removeFromFavorites'
import { useTheme } from '@mui/material/styles'
import { PALETTE } from '../styles/styleConsts'

interface FavoriteProps {
  paletteId: string
  favorites: number
  hasUserFavorited: boolean
  refetch: () => void
}

const Favorite = ({
  paletteId,
  favorites,
  hasUserFavorited,
  refetch,
}: FavoriteProps) => {
  // const [localFavorited, setLocalFavorited] = useState(hasUserFavorited)
  // const [localFavorites, setLocalFavorites] = useState(favorites)
  const isDark = useTheme().palette.mode === 'dark'

  const color = isDark ? PALETTE.grayscale[200] : PALETTE.grayscale[700]

  const addMutation = useMutation({
    mutationFn: () => addToFavorites({ paletteId }),
    // onMutate: async () => {
    //   setLocalFavorited(true)
    //   setLocalFavorites((prev) => prev + 1)
    // },
    onSettled: () => {
      refetch()
    },
    // onError: () => {
    //   setLocalFavorited(false)
    //   setLocalFavorites((prev) => prev - 1)
    // },
  })

  const removeMutation = useMutation({
    mutationFn: () => removeFromFavorites({ paletteId }),
    // onMutate: async () => {
    //   setLocalFavorited(false)
    //   setLocalFavorites((prev) => prev - 1)
    // },
    onSettled: () => {
      refetch()
    },
    // onError: () => {
    //   setLocalFavorited(true)
    //   setLocalFavorites((prev) => prev + 1)
    // },
  })

  return (
    <div>
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
            <FaHeart color={color} />
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
            <FaRegHeart color={color} />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}

export default Favorite
