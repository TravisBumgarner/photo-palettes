import { Typography } from '@mui/material'
import PageWrapper from '../styles/shared/PageWrapper'

import WhatWentWrongContactForm from '../sharedComponents/WhatWentWrongContactForm'

const Error500 = () => {
  return (
    <PageWrapper width="small" minHeight staticContent>
      <Typography variant="h2">
        Ohhh <span style={{ color: '#C0DEAD' }}>#C0DEAD</span>{' '}
      </Typography>
      <Typography>Something went wrong.</Typography>
      <WhatWentWrongContactForm />
    </PageWrapper>
  )
}

export default Error500
