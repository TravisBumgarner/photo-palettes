import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '../consts'
import Link from '../sharedComponents/Link'
import useGlobalStore from '../store'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'

const Profile = () => {
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)

  if (!appUserDetails) {
    return <Navigate to="/" />
  }

  return (
    <PageWrapper width="small" minHeight>
      <PageTitle text="User Settings" marginBottom />
      <List>
        <Typography variant="body1">
          <strong>Username:</strong> {appUserDetails.displayName.toUpperCase()}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {appUserDetails.email}
        </Typography>
        <Link href={ROUTES.passwordReset.href}>Change Password</Link>
      </List>
    </PageWrapper>
  )
}

export default Profile
