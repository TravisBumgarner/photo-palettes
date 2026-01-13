import Box from '@mui/material/Box'
import { useCallback } from 'react'

const Color = ({
  color,
  height,
  index,
  interactive,
}: {
  color: string
  height: number | string
  index: number
  interactive?: boolean
}) => {
  // This should find a new home.
  const handleScroll = useCallback(() => {
    document
      .getElementById(`color-${index}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [index])

  return (
    <Box
      {...(interactive ? { onClick: handleScroll } : {})}
      key={index}
      sx={{
        flexGrow: 1,
        height,
        backgroundColor: color,
        cursor: interactive ? 'pointer' : 'default',
      }}
    />
  )
}

const ColorBar = ({
  colors,
  height,
  interactive,
  direction,
}: {
  colors: string[]
  height: number | string
  interactive?: boolean
  direction?: 'row' | 'column'
}) => {
  return (
    colors.length > 0 && (
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          flexDirection: direction || 'row',
        }}
      >
        {colors.map((color, index) => (
          <Color
            key={index}
            interactive={interactive}
            color={color}
            index={index}
            height={height}
          />
        ))}
      </Box>
    )
  )
}

export default ColorBar
