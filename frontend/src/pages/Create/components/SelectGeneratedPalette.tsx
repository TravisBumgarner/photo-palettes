import Button from '@mui/material/Button'
import type { TGeneratedPalette } from '../../../types'

const SelectGeneratedPalette = ({
  generatedPalettes,
  handlePaletteSelection,
}: {
  generatedPalettes: TGeneratedPalette[]
  handlePaletteSelection: (palette: TGeneratedPalette) => void
}) => {
  const handlePaletteClick = (palette: TGeneratedPalette) => {
    handlePaletteSelection(palette)
  }

  return generatedPalettes.map((palette, index) => (
    <div key={index}>
      <h3>Palette {index + 1}</h3>
      <Button
        variant="contained"
        style={{ display: 'flex', gap: '10px' }}
        onClick={() => handlePaletteClick(palette)}
      >
        {palette.map(({ color }, colorIndex) => (
          <div
            key={colorIndex}
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: color,
              border: '1px solid #000',
            }}
          />
        ))}
      </Button>
    </div>
  ))
}

export default SelectGeneratedPalette
