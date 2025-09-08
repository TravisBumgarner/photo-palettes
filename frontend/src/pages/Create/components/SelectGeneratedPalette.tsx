import type { TGeneratedPalette } from '../../../types'
import Box from '@mui/material/Box'
import { SPACING } from '../../../styles/styleConsts'
import { useCallback } from 'react'

const SelectGeneratedPalette = ({
  generatedPalettes,
  handlePaletteChange,
}: {
  generatedPalettes: TGeneratedPalette[]
  handlePaletteChange: (palette: TGeneratedPalette) => void
}) => {
  return generatedPalettes.map((palette, index) => (
    <Palette
      height={30}
      palette={palette}
      index={index}
      handlePaletteChange={handlePaletteChange}
    />
  ))
}

const Palette = ({
  palette,
  height,
  handlePaletteChange,
}: {
  palette: TGeneratedPalette
  height: number
  index: number
  handlePaletteChange: (palette: TGeneratedPalette) => void
}) => {
  const handleClick = useCallback(() => {
    handlePaletteChange([...palette])
  }, [palette, handlePaletteChange])

  return (
    <Box
      component="button"
      onClick={handleClick}
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
