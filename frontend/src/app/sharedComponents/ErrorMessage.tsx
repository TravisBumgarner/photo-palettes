import { Box, Typography } from '@mui/material'

const ErrorMessage = ({ error }: { error?: string }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" color="error">
        {error ? error : 'Something went wrong :('}
      </Typography>
    </Box>
  )
}

export default ErrorMessage
