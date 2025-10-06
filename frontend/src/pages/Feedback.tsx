import Typography from '@mui/material/Typography'
import { ROUTES } from '../consts'
import ContactForm from '../sharedComponents/ContactForm'
import Link from '../sharedComponents/Link'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'

const Feedback = () => {
  return (
    <PageWrapper minHeight verticallyAlign width="small" staticContent>
      <PageTitle text="Feedback" />
      <Typography variant="body1">
        Join the discussion on{' '}
        <Link target="_blank" href={ROUTES.discord.href}>
          {ROUTES.discord.label}
        </Link>
        {' and '}
        <Link target="_blank" href={ROUTES.bluesky.href}>
          {ROUTES.bluesky.label}
        </Link>
        .
      </Typography>
      <ContactForm formSuffix="feedback" />
    </PageWrapper>
  )
}

export default Feedback
