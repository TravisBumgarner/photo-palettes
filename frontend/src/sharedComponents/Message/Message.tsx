import { Box, Button, Typography } from '@mui/material'
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '../../styles/styleConsts'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { useTheme } from '@mui/material/styles'
import { IoMdWarning } from 'react-icons/io'

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
  const theme = useTheme()

  return (
    <Box
      sx={{
        border: `1px solid`,
        borderColor: 'divider',
        borderRadius: BORDER_RADIUS.ZERO.PX,
        padding: SPACING.MEDIUM.PX,
        // margin: `${SPACING.MEDIUM.PX} 0`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        gap: SPACING.MEDIUM.PX,
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {color === 'error' ? (
          <IoMdWarning
            size={FONT_SIZES.LARGE.PX}
            color={theme.palette.error.main}
          />
        ) : (
          <IoInformationCircleOutline
            size={FONT_SIZES.LARGE.PX}
            color={theme.palette.info.main}
          />
        )}
        <Typography
          sx={{ marginLeft: SPACING.SMALL.PX }}
          variant="h5"
          color={color}
        >
          {message}
        </Typography>
      </Box>
      {callback && (
        <Button variant="contained" color={color} onClick={callback}>
          {callbackText}
        </Button>
      )}
    </Box>
  )
}

export default Message
