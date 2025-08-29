import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { ROUTES } from '../consts'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import Link from '../sharedComponents/Link'
import useGlobalStore from '../store'

const Contact = () => {
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addAlert = useGlobalStore((store) => store.addAlert)

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

  useEffect(() => {
    if (success) {
      addAlert('Thank you for your feedback!', 'success')
      setSuccess(false)
    }
    if (failure) {
      addAlert('Failed to send message.', 'error')
      setFailure(false)
    }
  }, [success, failure, addAlert])

  return (
    <PageWrapper minHeight width="small" staticContent>
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
            type="submit"
            disabled={isSubmitting || formData.message.length === 0}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </Box>
    </PageWrapper>
  )
}

export default Contact
