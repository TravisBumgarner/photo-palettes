import Typography from '@mui/material/Typography'
import PageWrapper from '../styles/shared/PageWrapper'

import ContactForm from '../sharedComponents/ContactForm'

const Error500 = () => {
  return (
    <PageWrapper
      minHeight
      verticallyAlign
      width="small"
      staticContent
    >
      <Typography variant="h2">
        Ohhh <span style={{ color: '#C0DEAD' }}>#C0DEAD</span>{' '}
      </Typography>
      <Typography>Something went wrong. What were you trying to do?</Typography>
      <ContactForm formSuffix="error500" />
    </PageWrapper>
  )
}

export default Error500
