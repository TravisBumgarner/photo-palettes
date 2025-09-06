import Box from '@mui/material/Box'
import { useInView } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { blurHashToDataURL } from '../utils/blurhashToDataURL'

interface Props {
  blurHash: string
  src: string
  useSquareImage?: boolean
  alt: string
  loadingStartCallback?: () => void
  loadingEndCallback?: (src: string) => void
  aspectRatio: number
}

const BlurImage = ({
  blurHash,
  src,
  alt,
  loadingStartCallback,
  loadingEndCallback,
  aspectRatio,
}: Props) => {
  const imgRef = useRef<HTMLImageElement>(null)

  const startLoadingImage = useInView(imgRef, {
    margin: '0px 0px 100px 0px',
    once: true,
  })

  const [imgLoaded, setImgLoaded] = useState(false)

  const blurDataURL = useMemo(() => blurHashToDataURL(blurHash), [blurHash])

  const handleOnLoad = useCallback(() => {
    setImgLoaded(true)
    loadingEndCallback?.(src)
  }, [loadingEndCallback, src])

  useEffect(() => {
    if (startLoadingImage) {
      loadingStartCallback?.()
    }
  }, [startLoadingImage, loadingStartCallback])

  // Safari be like. I have no idea.
  const cssProp =
    aspectRatio >= 1
      ? { width: '100%', maxHeight: '100%' }
      : { height: '100%', maxWidth: '100%' }

  return (
    <Box
      component="img"
      ref={imgRef}
      src={startLoadingImage || imgLoaded ? src : undefined}
      loading={startLoadingImage ? 'eager' : 'lazy'}
      rel={startLoadingImage ? 'preload' : ''}
      alt={alt}
      sx={{
        display: 'block',
        transition: 'all 0.3s ease',
        ...cssProp,
        ...(blurDataURL
          ? {
              backgroundImage: `url(${blurDataURL})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }
          : {}),
      }}
      onLoad={handleOnLoad}
    />
  )
}

export default BlurImage
