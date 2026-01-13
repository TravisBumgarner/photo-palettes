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
  maxDimensions?: { maxWidth?: string; maxHeight?: string } // Fuck fuck fuck.
  includeBorder?: boolean
}

const BlurImage = ({
  blurHash,
  src,
  alt,
  loadingStartCallback,
  loadingEndCallback,
  aspectRatio,
  maxDimensions,
  includeBorder,
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
  // >=1 is landscape
  // <1 is portrait
  const cssProp = aspectRatio >= 1 ? { width: '100%' } : { height: '100%' }

  return (
    <Box
      sx={{
        position: 'relative',
        ...cssProp,
        aspectRatio: `${aspectRatio}`,
        backgroundImage:
          blurDataURL && !imgLoaded ? `url(${blurDataURL})` : undefined,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        overflow: 'hidden',
        ...maxDimensions,
        ...(includeBorder ? { border: '10px solid white' } : {}),
      }}
    >
      <Box
        component="img"
        ref={imgRef}
        src={startLoadingImage || imgLoaded ? src : undefined}
        loading={startLoadingImage ? 'eager' : 'lazy'}
        rel={startLoadingImage ? 'preload' : ''}
        alt={alt}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          display: 'block',
          transition: 'all 0.3s ease',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        onLoad={handleOnLoad}
      />
    </Box>
  )
}

export default BlurImage
