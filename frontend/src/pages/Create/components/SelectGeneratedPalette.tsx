import type { TGeneratedPalette } from '../../../types'
import Box from '@mui/material/Box'
import { SPACING } from '../../../styles/styleConsts'
import { useCallback } from 'react'

const SelectGeneratedPalette = ({
  generatedPalettes,
  handlePaletteChange,
}: {
  generatedPalettes: TGeneratedPalette[]
  handlePaletteChange: (paletteIndex: number) => void
}) => {
  return generatedPalettes.map((palette, index) => (
    <Palette
      key={index}
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
  index,
  handlePaletteChange,
}: {
  palette: TGeneratedPalette
  height: number
  index: number
  handlePaletteChange: (index: number) => void
}) => {
  const handleClick = useCallback(() => {
    handlePaletteChange(index)
  }, [index, handlePaletteChange])

  return (
    <Box
      component="button"
      onClick={handleClick}
      sx={{
        display: 'flex',
        marginBottom: SPACING.TINY.PX,
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
