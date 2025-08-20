'use client'

import { Button, TextField, Typography } from '@mui/material'
import { redirect, useRouter } from 'next/navigation'
import { ChangeEvent, useCallback, useState } from 'react'
import { z } from 'zod'
import { MINIMUM_PASSWORD_LENGTH, ROUTES } from '../../consts'
import { login } from '../../services/supabase/actions'
import useGlobalStore from '../../store'
import { authFormCSS, PageTitle, PageWrapper } from '../../styles/Shared'
import Link from '../_sharedComponents/Link'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH),
})

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()
  const setTriggerFetchUser = useGlobalStore(state => state.setTriggerFetchUser)
  const appUserDetails = useGlobalStore(state => state.appUserDetails)

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setEmail(e.target.value)
  }, [])

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setPassword(e.target.value)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.target as HTMLFormElement)
      const result = LoginSchema.safeParse({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      })

      if (!result.success) {
        setError(result.error.message)
        return
      }

      const response = await login(formData)
      if (response.success) {
        setTriggerFetchUser(true)
        router.push('/')
      } else {
        setError(response.error)
        router.push('/error')
      }
    },
    [router, setTriggerFetchUser]
  )

  if (appUserDetails) {
    return redirect('/')
  }

  return (
    <PageWrapper minHeight verticallyAlign width="small">
      <form onSubmit={handleSubmit} style={authFormCSS}>
        <PageTitle text="Log In" center />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <TextField
          id="email"
          name="email"
          type="email"
          required
          label="Email"
          autoComplete="email"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          id="password"
          name="password"
          type="password"
          required
          label="Password"
          autoComplete="current-password"
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <Button variant="contained" type="submit" fullWidth>
          Log in
        </Button>
        <Typography variant="body1">
          {"Don't have an account? "}
          <Link href={ROUTES.signup.href}>{ROUTES.signup.label}</Link>.
        </Typography>
      </form>
    </PageWrapper>
  )
}
