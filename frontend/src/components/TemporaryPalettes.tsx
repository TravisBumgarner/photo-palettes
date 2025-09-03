import { useState, useEffect, useCallback } from 'react'
import { queries } from '../database'
import type { TemporaryPalette } from '../database/types'

const TemporaryPalettes = () => {
  const [palettes, setPalettes] = useState<TemporaryPalette[]>([])

  useEffect(() => {
    queries.getTemporaryPalettes().then((r) => setPalettes(r))
  }, [])

  const handleDelete = useCallback(async (palette: TemporaryPalette) => {
    await queries.deleteTemporaryPalette(palette.tempId)
    setPalettes((prev) => prev.filter((p) => p.tempId !== palette.tempId))
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
            <button onClick={() => handleDelete(palette)}>Delete</button>
          </div>
        )
      })}
    </div>
  )
}

export default TemporaryPalettes
