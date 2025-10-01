import type { TPalette } from '../../../types'
import BlurImage from '../../BlurImage'
import { MODAL_ID } from '../Modal.consts'
import DefaultModal from './DefaultModal'

export interface LightboxProps {
  id: typeof MODAL_ID.LIGHTBOX_MODAL
  palette: TPalette
}

const Lightbox = ({ palette }: LightboxProps) => {
  return (
    <DefaultModal
      sx={{
        width: '80vw',
        maxHeight: '80vh',
        aspectRatio: palette.aspectRatio,
      }}
    >
      <BlurImage
        alt="Enlarged photo"
        src={palette.photoUrl}
        blurHash={palette.blurhash}
        aspectRatio={palette.aspectRatio}
      />
    </DefaultModal>
  )
}

export default Lightbox
