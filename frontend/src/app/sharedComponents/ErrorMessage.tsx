import { Box, Button, Typography } from '@mui/material'
import { PALETTE, SPACING } from '../../styles/Theme'

const ErrorMessage = ({ error, callback }: { error?: string; callback?: () => void }) => {
  return (
    <Box sx={{ padding: SPACING.MEDIUM.PX }}>
      <Typography
        variant="h5"
        color="error"
        sx={{
          border: `1px solid ${PALETTE.secondary[900]}`,
          borderRadius: 1,
          backgroundColor: PALETTE.secondary[50],
          padding: SPACING.MEDIUM.PX,
          margin: `${SPACING.MEDIUM.PX} 0`,
        }}
      >
        {error ? error : 'Something went wrong :('}
      </Typography>
      {callback && <Button onClick={callback}>Try again</Button>}
    </Box>
  )
}

export default ErrorMessage
