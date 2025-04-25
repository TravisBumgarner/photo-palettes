import { Box, Typography } from '@mui/material'

const InfoMessage = ({ info }: { info: string }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" color="info">
        {info}
      </Typography>
    </Box>
  )
}

export default InfoMessage
