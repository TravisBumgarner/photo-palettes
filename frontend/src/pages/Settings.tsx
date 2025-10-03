import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '../consts'
import Link from '../sharedComponents/Link'
import { MODAL_ID } from '../sharedComponents/Modal/Modal.consts'
import { activeModalSignal } from '../signals'
import useGlobalStore from '../store'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import { SPACING } from '../styles/styleConsts'

const Profile = () => {
  const appUser = useGlobalStore((state) => state.appUser)
  const authUser = useGlobalStore((state) => state.authUser)

  const handleModalOpen = useCallback(() => {
    activeModalSignal.value = {
      id: MODAL_ID.CONFIRM_ACCOUNT_DELETION_MODAL,
    }
  }, [])

  if (!appUser || !authUser) {
    return <Navigate to="/" />
  }

  const isEmailAuth =
    !!authUser &&
    !!authUser.identities &&
    authUser.identities[0].provider === 'email'

  const regDate = new Date(authUser.created_at).toDateString()
  return (
    <PageWrapper width="small" minHeight>
      <PageTitle text="User Settings" marginBottom />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.SMALL.PX,
        }}
      >
        <Typography variant="body1">
          <strong>Username:</strong> {appUser.displayName.toUpperCase()}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {appUser.email}
        </Typography>
        {isEmailAuth && (
          <Typography variant="body1">
            <strong>Password:</strong>{' '}
            <Link href={ROUTES.passwordReset.href}>Change Password</Link>
          </Typography>
        )}
        <Typography variant="body1">
          <strong>Registration Date:</strong> {regDate}
        </Typography>
        <Box>
          <Button variant="outlined" onClick={handleModalOpen}>
            Delete Account
          </Button>
        </Box>
      </Box>
    </PageWrapper>
  )
}

export default Profile
