import { IconButton, Tooltip } from '@mui/material'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useMutation } from '@tanstack/react-query'
import addToFavorites from '../api/favorites/addToFavorites'
import removeFromFavorites from '../api/favorites/removeFromFavorites'

interface FavoriteProps {
  paletteId: string
  favorites: number
  hasUserFavorited: boolean
}

import { useState } from 'react'

const Favorite = ({
  paletteId,
  favorites,
  hasUserFavorited,
}: FavoriteProps) => {
  const [localFavorited, setLocalFavorited] = useState(hasUserFavorited)
  const [localFavorites, setLocalFavorites] = useState(favorites)

  const addMutation = useMutation({
    mutationFn: () => addToFavorites({ paletteId }),
    onMutate: async () => {
      setLocalFavorited(true)
      setLocalFavorites((prev) => prev + 1)
    },
    onError: () => {
      setLocalFavorited(false)
      setLocalFavorites((prev) => prev - 1)
    },
  })

  const removeMutation = useMutation({
    mutationFn: () => removeFromFavorites({ paletteId }),
    onMutate: async () => {
      setLocalFavorited(false)
      setLocalFavorites((prev) => prev - 1)
    },
    onError: () => {
      setLocalFavorited(true)
      setLocalFavorites((prev) => prev + 1)
    },
  })

  return (
    <div>
      <span>{localFavorites}</span>
      {localFavorited ? (
        <Tooltip title="Remove from favorites">
          <IconButton
            aria-label="unfavorite-palette"
            aria-controls={'unfavorite-palette'}
            onClick={() => removeMutation.mutate()}
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
            onClick={() => addMutation.mutate()}
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
