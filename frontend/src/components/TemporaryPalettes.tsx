import { useState, useEffect } from 'react'
import { queries } from '../database'
import type { TemporaryPalette } from '../database/types'

const TemporaryPalettes = () => {
  const [palettes, setPalettes] = useState<TemporaryPalette[]>([])

  useEffect(() => {
    queries.getTemporaryPalettes().then((r) => setPalettes(r))
  }, [])

  if (palettes.length === 0) {
    return <div>No temporary palettes found.</div>
  }

  return (
    <div>
      {palettes.map((palette) => {
        const imageUrl =
          typeof palette.image === 'string'
            ? palette.image
            : URL.createObjectURL(palette.image)
        return (
          <div key={palette.tempId}>
            <div>{palette.name}</div>
            <img style={{ width: '100px' }} src={imageUrl} alt={palette.name} />
          </div>
        )
      })}
    </div>
  )
}

export default TemporaryPalettes
