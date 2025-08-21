'use client'

import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'

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

  const resetButtonText = useCallback(() => {
    setTimeout(() => {
      setSuccess(false)
      setFailure(false)
    }, 3_000)
  }, [])

  const buttonText = useMemo(() => {
    if (isSubmitting) {
      return 'Sending...'
    }
    if (success) {
      resetButtonText()
      return 'Thanks for your help!'
    }
    if (failure) {
      resetButtonText()
      return 'Failed to send message.'
    }
    return 'Send'
  }, [isSubmitting, success, failure, resetButtonText])

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
            type="submit"
            disabled={isSubmitting || formData.message.length === 0}
          >
            {buttonText}
          </Button>
        </form>
      </Box>
    </>
  )
}

export default WhatWentWrongContactForm
