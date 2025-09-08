import type { TGeneratedPalette } from '../../../types'
import Box from '@mui/material/Box'
import { SPACING } from '../../../styles/styleConsts'
import { useCallback } from 'react'

const SelectGeneratedPalette = ({
  generatedPalettes,
  setActivePalette,
}: {
  generatedPalettes: TGeneratedPalette[]
  setActivePalette: React.Dispatch<
    React.SetStateAction<TGeneratedPalette | null>
  >
}) => {
  return generatedPalettes.map((palette, index) => (
    <Palette
      height={30}
      palette={palette}
      index={index}
      setActivePalette={setActivePalette}
    />
  ))
}

const Palette = ({
  palette,
  height,
  setActivePalette,
}: {
  palette: TGeneratedPalette
  height: number
  index: number
  setActivePalette: React.Dispatch<
    React.SetStateAction<TGeneratedPalette | null>
  >
}) => {
  const handlePaletteChange = useCallback(() => {
    setActivePalette(palette)
  }, [palette, setActivePalette])

  return (
    <Box
      component="button"
      onClick={handlePaletteChange}
      sx={{
        display: 'flex',
        marginBottom: SPACING.SMALL.PX,
        width: '100%',
        border: 0,
        cursor: 'pointer',
      }}
    >
      {Object.values(palette).map(({ color }, index) => (
        <Box
          key={index}
          sx={{
            flexGrow: 1,
            height,
            backgroundColor: color,
          }}
        />
      ))}
    </Box>
  )
}

export default SelectGeneratedPalette
