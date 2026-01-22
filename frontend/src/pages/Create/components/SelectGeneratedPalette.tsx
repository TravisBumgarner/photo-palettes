import type { TGeneratedPaletteWithName } from '../../../types'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { SPACING } from '../../../styles/styleConsts'
import { useCallback } from 'react'

const SelectGeneratedPalette = ({
  generatedPalettes,
  handlePaletteChange,
  useSingleColumnDisplay,
}: {
  generatedPalettes: TGeneratedPaletteWithName[]
  handlePaletteChange: (paletteIndex: number) => void
  useSingleColumnDisplay: boolean
}) => {
  return (
    <Box sx={{ columns: useSingleColumnDisplay ? 2 : 1 }}>{generatedPalettes.map((palette, index) => (
      <Palette
        key={index}
        height={30}
        palette={palette}
        index={index}
        handlePaletteChange={handlePaletteChange}
      />
    ))}
    </Box>
  )
}

const Palette = ({
  palette,
  height,
  index,
  handlePaletteChange,
}: {
  palette: TGeneratedPaletteWithName
  height: number
  index: number
  handlePaletteChange: (index: number) => void
}) => {
  const handleClick = useCallback(() => {
    handlePaletteChange(index)
  }, [index, handlePaletteChange])

  return (
    <Tooltip title={palette.name} arrow placement="right">
      <Box
        component="button"
        onClick={handleClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: SPACING.TINY.PX,
          border: 0,
          cursor: 'pointer',
          padding: 0,
          background: 'transparent',
          width: '100%'
        }}
      >
        <Box sx={{ display: 'flex', width: '100%' }}>
          {palette.swatches.map(({ color }, swatchIndex) => (
            <Box
              key={swatchIndex}
              sx={{
                flexGrow: 1,
                height,
                backgroundColor: color,
              }}
            />
          ))}
        </Box>
      </Box>
    </Tooltip>
  )
}

export default SelectGeneratedPalette
