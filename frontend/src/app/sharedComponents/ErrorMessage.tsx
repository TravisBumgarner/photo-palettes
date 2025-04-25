import { Box, Button, Typography } from '@mui/material'

const ErrorMessage = ({ error, callback }: { error?: string; callback?: () => void }) => {
  return (
    <Box sx={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Typography variant="h5" color="error">
        {error ? error : 'Something went wrong :('}
      </Typography>
      {callback && <Button onClick={callback}>Try again</Button>}
    </Box>
  )
}

export default ErrorMessage
