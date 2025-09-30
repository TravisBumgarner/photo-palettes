import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { type ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { MINIMUM_PASSWORD_LENGTH, ROUTES } from '../consts'
import { resetPassword, updatePassword } from '../services/supabase'
import authFormCSS from '../styles/shared/authFormCSS'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
// import { trackEvent } from '../services/analytics'
import Link from '../sharedComponents/Link'
import useGlobalStore from '../store'

const EmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const PasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        MINIMUM_PASSWORD_LENGTH,
        `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters`
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export default function PasswordResetPage() {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const appUserDetails = useGlobalStore((state) => state.appUserDetails)

  // Check if this is a password update (user clicked email link) or reset request
  const isPasswordUpdate =
    searchParams.has('access_token') || searchParams.has('type')

  useEffect(() => {
    // If user is already logged in and this isn't a password update, redirect
    if (appUserDetails && !isPasswordUpdate) {
      navigate('/')
    }
  }, [appUserDetails, isPasswordUpdate, navigate])

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setMessage(null)
    setEmail(e.target.value)
  }, [])

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null)
      setPassword(e.target.value)
    },
    []
  )

  const handleConfirmPasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null)
      setConfirmPassword(e.target.value)
    },
    []
  )

  const handleResetRequest = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)

      const result = EmailSchema.safeParse({ email })

      if (!result.success) {
        setError(result.error.issues[0].message)
        setIsLoading(false)
        return
      }

      const response = await resetPassword(email)

      if (response.success) {
        setMessage(
          'Password reset instructions have been sent to your email. Please check your inbox and spam folder.'
        )
        setEmail('')
        // trackEvent for password reset requested could be added to analytics types
      } else {
        setError(response.error || 'Failed to send reset email')
      }

      setIsLoading(false)
    },
    [email]
  )

  const handlePasswordUpdate = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)

      const result = PasswordSchema.safeParse({ password, confirmPassword })

      if (!result.success) {
        setError(result.error.issues[0].message)
        setIsLoading(false)
        return
      }

      const response = await updatePassword(password)

      if (response.success) {
        setMessage('Password updated successfully! Redirecting to login...')
        // trackEvent for password reset completed could be added to analytics types

        // Redirect after a short delay
        setTimeout(() => {
          navigate(ROUTES.login.href)
        }, 2000)
      } else {
        setError(response.error || 'Failed to update password')
      }

      setIsLoading(false)
    },
    [password, confirmPassword, navigate]
  )

  // If user is logged in and not updating password, redirect
  if (appUserDetails && !isPasswordUpdate) {
    return <Navigate to="/" />
  }

  return (
    <PageWrapper minHeight verticallyAlign width="small">
      <form
        onSubmit={isPasswordUpdate ? handlePasswordUpdate : handleResetRequest}
        style={authFormCSS}
      >
        <PageTitle
          text={isPasswordUpdate ? 'Set New Password' : 'Reset Password'}
          center
        />

        {error && (
          <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1, mb: 2 }}>
            <Typography color="error.contrastText">{error}</Typography>
          </Box>
        )}

        {message && (
          <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, mb: 2 }}>
            <Typography color="success.contrastText">{message}</Typography>
          </Box>
        )}

        {!isPasswordUpdate ? (
          // Email reset form
          <>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Enter your email address and we'll send you instructions to reset
              your password.
            </Typography>
            <TextField
              id="email"
              name="email"
              type="email"
              required
              label="Email Address"
              autoComplete="email"
              fullWidth
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </>
        ) : (
          // Password update form
          <>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Enter your new password below.
            </Typography>
            <TextField
              id="password"
              name="password"
              type="password"
              required
              label="New Password"
              autoComplete="new-password"
              fullWidth
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              label="Confirm New Password"
              autoComplete="new-password"
              fullWidth
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              disabled={isLoading}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </>
        )}
        <Box>
          <Typography variant="body1">
            Remember your password?{' '}
            <Link href={ROUTES.login.href}>{ROUTES.login.label}</Link>
          </Typography>

          {!isPasswordUpdate && (
            <Typography variant="body1">
              {"Don't have an account? "}
              <Link href={ROUTES.signup.href}>{ROUTES.signup.label}</Link>
            </Typography>
          )}
        </Box>
      </form>
    </PageWrapper>
  )
}
