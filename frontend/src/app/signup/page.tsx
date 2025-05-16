'use client'

import { Box, Button, TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useCallback, useState } from 'react'
import { z } from 'zod'
import config from '../../config'
import { MINIMUM_PASSWORD_LENGTH } from '../../consts'
import { signup } from '../../services/supabase/actions'
import useGlobalStore from '../../store'
import { ModalID } from '../sharedComponents/Modal/Modal.consts'
import { authFormCSS } from '../../styles/Shared'

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH),
  repeatPassword: z.string().min(MINIMUM_PASSWORD_LENGTH),
})

// Congrats, you found the secret invitation key!
// The rest of the app is quite secure.
const SUPER_SECRET_INVITATION_KEY = 'welcome-to-photo-palettes'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [invitationKey, setInvitationKey] = useState(
    config.is_production ? '' : SUPER_SECRET_INVITATION_KEY
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
      }}
    >
      <form onSubmit={handleSubmit} style={authFormCSS}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <TextField
          id="invitationKey"
          name="invitationKey"
          type="text"
          required
          value={invitationKey}
          onChange={handleInvitationKeyChange}
          placeholder="Enter invitation key"
          label="Invitation Key"
          fullWidth
          autoComplete="off"
        />
        <TextField
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter email"
          label="Email"
          fullWidth
          autoComplete="email"
        />
        <TextField
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter password"
          label="Password"
          fullWidth
          autoComplete="new-password"
        />
        <TextField
          id="repeatPassword"
          name="repeatPassword"
          type="password"
          required
          value={repeatPassword}
          onChange={handleRepeatPasswordChange}
          placeholder="Enter password again"
          label="Repeat Password"
          fullWidth
          autoComplete="new-password"
        />
        <Button
          variant="contained"
          disabled={!invitationKey || !password || !repeatPassword || !email}
          type="submit"
          fullWidth
        >
          Sign up
        </Button>
      </form>
    </Box>
  )
}
