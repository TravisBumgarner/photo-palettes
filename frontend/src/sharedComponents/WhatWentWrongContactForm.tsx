import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Message from './Message'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

const WhatWentWrongContactForm = () => {
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: 'photo-palettes-something-went-wrong',
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
    <>
      <Typography variant="body1">What were you trying to do?</Typography>
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
    </>
  )
}

export default WhatWentWrongContactForm
