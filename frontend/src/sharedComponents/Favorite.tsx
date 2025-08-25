import { IconButton, Tooltip } from '@mui/material'
import { FaHeart } from 'react-icons/fa'
import { FaRegHeart } from 'react-icons/fa'
import addToFavorites from '../api/favorites/addToFavorites'
import removeFromFavorites from '../api/favorites/removeFromFavorites'

const Favorite = ({
  paletteId,
  favorites,
  hasUserFavorited,
}: {
  paletteId: string
  favorites: number
  hasUserFavorited: boolean
}) => {
  const handleAddToFavoritesClick = () => {
    addToFavorites({ paletteId })
  }
  const handleRemoveFromFavoritesClick = () => {
    removeFromFavorites({ paletteId })
  }

  return (
    <div>
      <span>{favorites} favorites</span>
      {!hasUserFavorited ? (
        <Tooltip title="Remove from favorites">
          <IconButton
            aria-label="unfavorite-palette"
            aria-controls={'unfavorite-palette'}
            onClick={handleRemoveFromFavoritesClick}
          >
            <FaHeart color="red" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add to favorites">
          <IconButton
            aria-label="favorite-palette"
            aria-controls={'favorite-palette'}
            onClick={handleAddToFavoritesClick}
          >
            <FaRegHeart color="grey" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}

export default Favorite
