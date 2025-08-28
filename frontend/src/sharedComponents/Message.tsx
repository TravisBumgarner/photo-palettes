import { Box, Button, Typography } from '@mui/material'
import { BORDER_RADIUS, SPACING } from '../styles/styleConsts'

const Message = ({
  message,
  color,
  callback,
  callbackText,
}: {
  message: string
  color: 'info' | 'error'
  callback?: () => void
  callbackText?: string
}) => {
  return (
    <Box
      sx={{
        border: `1px solid`,
        borderColor: 'divider',
        borderRadius: BORDER_RADIUS.ZERO.PX,
        padding: SPACING.SMALL.PX,
        margin: `${SPACING.MEDIUM.PX} 0`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
      }}
    >
      <Typography variant="h5" color={color}>
        {message}
      </Typography>
      {callback && <Button onClick={callback}>{callbackText}</Button>}
    </Box>
  )
}

export default Message
