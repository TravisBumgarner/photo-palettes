import Box from '@mui/material/Box'
import { useCallback } from 'react'

const Color = ({
  color,
  height,
  index,
  interactive,
}: {
  color: string
  height: number
  index: number
  interactive?: boolean
}) => {
  // This should find a new home.
  const handleScroll = useCallback(() => {
    document
      .getElementById(`color-${index}`)
      ?.scrollIntoView({ behavior: 'smooth' })
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
}: {
  colors: string[]
  height: number
  interactive?: boolean
}) => {
  return (
    colors.length > 0 && (
      <Box
        sx={{
          display: 'flex',
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
