import type { TGeneratedPalette } from '../../../types'

const SelectGeneratedPalette = ({
  generatedPalettes,
}: {
  generatedPalettes: TGeneratedPalette[]
}) => {
  return generatedPalettes.map((palette, index) => (
    <div key={index}>
      <h3>Palette {index + 1}</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
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
      </div>
    </div>
  ))
}

export default SelectGeneratedPalette
