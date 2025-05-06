import { Box, Typography } from '@mui/material'
import { PALETTE, SPACING } from '../../styles/Theme'

const InfoMessage = ({ info }: { info: string }) => {
  return (
    <Box sx={{ padding: SPACING.MEDIUM.PX }}>
      <Typography
        variant="h5"
        color="info"
        sx={{
          border: `1px solid ${PALETTE.primary[900]}`,
          borderRadius: 1,
          backgroundColor: PALETTE.primary[50],
          padding: SPACING.MEDIUM.PX,
          margin: `${SPACING.MEDIUM.PX} 0`,
        }}
      >
        {info}
      </Typography>
    </Box>
  )
}

export default InfoMessage
