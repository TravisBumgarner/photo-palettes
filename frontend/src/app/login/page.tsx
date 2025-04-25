'use client'

import { Box, Button, TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { z } from 'zod'
import { MINIMUM_PASSWORD_LENGTH } from '../../consts'
import { login } from '../../services/supabase/actions'
import useGlobalStore from '../../store'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH),
})

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const setIsAppAuthenticating = useGlobalStore(state => state.setIsAppAuthenticating)

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
        setIsAppAuthenticating(true)
        router.push('/')
      } else {
        setError(response.error)
        router.push('/error')
      }
    },
    [router, setIsAppAuthenticating]
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
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '400px' }}
      >
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <TextField
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter email"
          label="Email"
          autoComplete="email"
          fullWidth
        />
        <TextField
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter password"
          label="Password"
          autoComplete="current-password"
          fullWidth
        />
        <Button variant="contained" type="submit" fullWidth>
          Log in
        </Button>
      </form>
    </Box>
  )
}
