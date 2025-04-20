import { Box } from '@mui/material'

const StaticContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        width: '100%',
        maxWidth: '800px',
        margin: '0px auto',
        padding: '20px',
        boxSizing: 'border-box',
        fontSize: '30px',
      }}
    >
      {children}
    </Box>
  )
}

export default StaticContentWrapper
