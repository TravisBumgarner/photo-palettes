import { Box, Typography } from '@mui/material'
import { PALETTE } from '../../styles/Theme'

const InfoMessage = ({ info }: { info: string }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        textAlign="center"
        variant="h5"
        sx={{
          color: PALETTE.primary[900],
          border: `1px solid ${PALETTE.primary[900]}`,
          borderRadius: 1,
          backgroundColor: PALETTE.primary[50],
          padding: '10px',
          margin: '10px 0',
        }}
      >
        {info}
      </Typography>
    </Box>
  )
}

export default InfoMessage
