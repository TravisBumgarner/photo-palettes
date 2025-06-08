'use client'

import { Button, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useCallback, useState } from 'react'
import { z } from 'zod'
import { MINIMUM_PASSWORD_LENGTH, ROUTES, SUPER_SECRET_INVITATION_KEY } from '../../consts'
import { signup } from '../../services/supabase/actions'
import useGlobalStore from '../../store'
import { ModalID } from '../_sharedComponents/Modal/Modal.consts'
import { authFormCSS, PageTitle, PageWrapper } from '../../styles/Shared'
import Link from '../_sharedComponents/Link'
import { getLocalStorage, LOCAL_STORAGE_KEYS } from '../../utils/localStorage'

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH),
  repeatPassword: z.string().min(MINIMUM_PASSWORD_LENGTH),
})


export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [invitationKey, setInvitationKey] = useState<string>(
    getLocalStorage(LOCAL_STORAGE_KEYS.SIGNUP_CODE, '')
  )
  const router = useRouter()
  const setIsAppAuthenticating = useGlobalStore(state => state.setIsAppAuthenticating)
  const setActiveModal = useGlobalStore(state => state.setActiveModal)

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null)
      const newPassword = e.target.value
      setPassword(newPassword)
    },
    [setPassword]
  )

  const handleRepeatPasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null)
      const newRepeatPassword = e.target.value
      setRepeatPassword(newRepeatPassword)
    },
    [setRepeatPassword]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (invitationKey !== SUPER_SECRET_INVITATION_KEY) {
        setError('Invalid invitation key')
        return
      }

      if (password !== repeatPassword) {
        setError('Passwords do not match')
        return
      }

      const result = SignupSchema.safeParse({ email, password, repeatPassword })
      if (!result.success) {
        setError(result.error.message)
        return
      }

      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)

      try {
        const response = await signup(formData)
        if (response.success) {
          setIsAppAuthenticating(true)
          setActiveModal({
            id: ModalID.ConfirmationModal,
            title: 'Signup Successful',
            body: 'Check your email for a confirmation.',
            confirmationCallback: () => {
              router.push('/')
            },
          })
        } else {
          setError(response.error)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during signup')
      }
    },
    [email, password, repeatPassword, invitationKey, router, setIsAppAuthenticating, setActiveModal]
  )

  const handleInvitationKeyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null)
      setInvitationKey(e.target.value)
    },
    [setInvitationKey]
  )

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null)
      setEmail(e.target.value)
    },
    [setEmail]
  )

  return (
    <PageWrapper minHeight verticallyAlign width="small">
      <form onSubmit={handleSubmit} style={authFormCSS}>
        <PageTitle center text="Sign Up" />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <TextField
          id="invitationKey"
          name="invitationKey"
          type="text"
          required
          value={invitationKey}
          onChange={handleInvitationKeyChange}
          label="Invitation key"
          fullWidth
          autoComplete="off"
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={handleEmailChange}
          label="Email"
          fullWidth
          autoComplete="email"
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={handlePasswordChange}
          label="Password"
          fullWidth
          autoComplete="new-password"
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          id="repeatPassword"
          name="repeatPassword"
          type="password"
          required
          value={repeatPassword}
          onChange={handleRepeatPasswordChange}
          label="Repeat Password"
          fullWidth
          autoComplete="new-password"
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <Button
          variant="contained"
          disabled={!invitationKey || !password || !repeatPassword || !email}
          type="submit"
          fullWidth
        >
          Sign up
        </Button>
        <Typography variant="body1">
          {'Have have an account? '}
          <Link href={ROUTES.login.href}>{ROUTES.login.label}</Link>.
        </Typography>
      </form>
    </PageWrapper>
  )
}
