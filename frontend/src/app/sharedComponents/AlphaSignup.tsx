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

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <input
          style={{
            border: '2px solid var(--foreground)',
            padding: '10px',
            fontFamily: 'satoshi',
            fontSize: '20px',
            borderRadius: '5px',
            marginRight: '10px',
            height: '60px',
            boxSizing: 'border-box',
            width: '300px',
            fontWeight: 'bold',
          }}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
        />
        <button
          style={{
            backgroundColor: 'var(--foreground)',
            color: 'var(--background)',
            padding: '10px',
            borderRadius: '5px',
            fontFamily: 'satoshi',
            fontSize: '20px',
            border: 'none',
            height: '60px',
            boxSizing: 'border-box',
            fontWeight: 'bold',
            width: '200px',
          }}
          onClick={handleSubmit}
          disabled={email.length === 0}
        >
          Join the Alpha!
        </button>
      </div>
    </>
  )
}

export default AlphaSignup
