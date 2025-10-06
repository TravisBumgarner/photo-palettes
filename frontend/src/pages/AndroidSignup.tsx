import Typography from '@mui/material/Typography'

import ContactForm from '../sharedComponents/ContactForm'
import PageWrapper from '../styles/shared/PageWrapper'

const AndroidSignup = () => {
  return (
    <PageWrapper verticallyAlign width="small" minHeight staticContent>
      <Typography variant="h2">Android Signup</Typography>
      <Typography>
        Android requires 12 users to test an application before it can be made
        available on the Play Store. If you're interested in helping test,
        please fill out the form below.
      </Typography>
      <ContactForm formSuffix="android-signup" />
    </PageWrapper>
  )
}

export default AndroidSignup
