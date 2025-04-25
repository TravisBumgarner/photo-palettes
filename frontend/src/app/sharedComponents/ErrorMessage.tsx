import { Box, Button, Typography } from '@mui/material'

const ErrorMessage = ({ error, callback }: { error?: string; callback?: () => void }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" color="error">
        {error ? error : 'Something went wrong :('}
        {callback && <Button onClick={callback}>Try again</Button>}
      </Typography>
    </Box>
  )
}

export default ErrorMessage
