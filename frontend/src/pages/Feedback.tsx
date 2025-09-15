import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ROUTES } from '../consts'
import Link from '../sharedComponents/Link'
import Message from '../sharedComponents/Message'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'

const Contact = () => {
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: 'photo-palettes-feedback',
  })

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    },
    [formData]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      const response = await fetch('https://contact-form.nfshost.com/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        setSuccess(true)
        setFormData((prev) => ({
          ...prev,
          ...{
            name: '',
            email: '',
            message: '',
          },
        }))
      } else {
        setFailure(true)
      }
      setIsSubmitting(false)
    },
    [formData]
  )

  const buttonMessage = useMemo(() => {
    if (isSubmitting) return 'Sending...'
    if (success) return 'Message Sent!'
    if (failure) return 'Failed to send'
    return 'Send'
  }, [isSubmitting, success, failure])

  useEffect(() => {
    setTimeout(() => {
      if (success) {
        setSuccess(false)
      }
      if (failure) {
        setFailure(false)
      }
    }, 5000)
  }, [success, failure])

  return (
    <PageWrapper minHeight verticallyAlign width="small" staticContent>
      <PageTitle text="Feedback" />
      <Typography variant="body1">
        Join the discussion on{' '}
        <Link target="_blank" href={ROUTES.discord.href}>
          {ROUTES.discord.label}
        </Link>
        {' and '}
        <Link target="_blank" href={ROUTES.bluesky.href}>
          {ROUTES.bluesky.label}
        </Link>
        .
      </Typography>
      <Box sx={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            width: '100%',
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            placeholder="Name (Optional)"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            placeholder="Email (Optional)"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
          />
          <TextField
            placeholder="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            multiline
          />
          <Button
            variant="contained"
            type="submit"
            disabled={isSubmitting || formData.message.length === 0}
          >
            {buttonMessage}
          </Button>
        </form>
        {success && (
          <Message
            includeVerticalMargin
            message="Thank you for your feedback!"
            color="success"
          />
        )}
        {failure && (
          <Message
            includeVerticalMargin
            message="Failed to send feedback. Please try again later."
            color="error"
          />
        )}
      </Box>
    </PageWrapper>
  )
}

export default Contact
