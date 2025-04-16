'use client'

import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import { z } from 'zod'
import { MINIMUM_PASSWORD_LENGTH } from '../../consts'
import { signup } from '../../services/supabase/actions'
import useGlobalStore from '../../store'
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
  const router = useRouter()
  const setIsAppAuthenticating = useGlobalStore(state => state.setIsAppAuthenticating)

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
  }

  const handleRepeatPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newRepeatPassword = e.target.value
    setRepeatPassword(newRepeatPassword)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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
        router.push('/')
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        value={password}
        onChange={handlePasswordChange}
      />
      <label htmlFor="repeatPassword">Repeat Password:</label>
      <input
        id="repeatPassword"
        name="repeatPassword"
        type="password"
        required
        value={repeatPassword}
        onChange={handleRepeatPasswordChange}
      />
      <button type="submit">Sign up</button>
    </form>
  )
}
