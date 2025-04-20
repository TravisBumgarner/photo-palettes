import { Button, TextField } from '@mui/material'
import { ChangeEvent, useCallback, useState } from 'react'
import { z } from 'zod'
import { alphaSignup } from '../../api/alphaSignup'
import { logger } from '../../services/logging'
const formValidation = z.object({
  email: z.string().email(),
})

const AlphaSignup = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = useCallback(async () => {
    const validationResult = formValidation.safeParse({ email })
    if (!validationResult.success) {
      alert('Please enter a valid email address.')
      return
    }
    try {
      await alphaSignup(email)
      alert('Thank you for signing up!')
      setEmail('')
    } catch (error) {
      logger.error('Error signing up', error)
      alert('An error occurred while signing up. Please try again.')
    }
  }, [email])

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value)
    },
    [setEmail]
  )

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Get Involved</h2>

      {/* ProtonPass appears to be injecting stuff that's causing issues with this form. Suppress those warnings. */}
      <form
        suppressHydrationWarning
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '300px',
          gap: '20px',
          margin: '0 auto',
        }}
      >
        <TextField
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          sx={{
            width: '100%',
            fontSize: '20px',
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={email.length === 0}
          sx={{
            width: '100%',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          Join the Alpha!
        </Button>
      </form>
    </>
  )
}

export default AlphaSignup
