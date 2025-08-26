import { IconButton, Tooltip } from '@mui/material'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useMutation } from '@tanstack/react-query'
import addToFavorites from '../api/favorites/addToFavorites'
import removeFromFavorites from '../api/favorites/removeFromFavorites'

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
      <span>{favorites}</span>
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
            <FaHeart color="red" />
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
            <FaRegHeart color="grey" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}

export default Favorite
