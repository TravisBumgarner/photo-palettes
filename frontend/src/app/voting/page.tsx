'use client'

import { Box, Button, TextField, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useState } from 'react'
import { addFeatureRequest, getFeatureRequests } from '../../api/featureRequests'
import useGlobalStore from '../../store'
import { EPermissionLevel, TFeatureRequest } from '../../types'
import Link from '../sharedComponents/Link'

const FeatureRequestCard = ({ featureRequest }: { featureRequest: TFeatureRequest }) => {
  return (
    <Box>
      <Typography variant="h1">{featureRequest.title}</Typography>
      <Typography variant="body1">{featureRequest.description}</Typography>
    </Box>
  )
}

const NewFeatureSubmission = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmitFeatureRequest = useCallback(() => {
    addFeatureRequest(title, description)
  }, [title, description])

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }, [])

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }, [])

  return (
    <Box>
      <Typography variant="h1">New Feature Submission</Typography>
      <TextField label="Title" value={title} onChange={handleTitleChange} />
      <TextField label="Description" value={description} onChange={handleDescriptionChange} />
      <Button onClick={handleSubmitFeatureRequest}>Submit</Button>
    </Box>
  )
}

const Voting = () => {
  const appUserDetails = useGlobalStore(store => store.appUserDetails)

  const { data, isLoading, error } = useQuery({
    queryKey: ['feature-requests'],
    queryFn: getFeatureRequests,
  })

  if (isLoading) {
    return <Box>Loading...</Box>
  }

  if (error || !data?.success) {
    return <Box>Error: {error?.message}</Box>
  }

  return (
    <Box>
      <Typography variant="h1">Voting</Typography>
      <Typography variant="body1">
        Want to discuss or suggest a feature? <Link href="/feedback">Click here</Link>
      </Typography>
      {appUserDetails && appUserDetails?.permissionLevel >= EPermissionLevel.MODERATOR && (
        <NewFeatureSubmission />
      )}
      {data.featureRequests.map(featureRequest => (
        <FeatureRequestCard key={featureRequest.id} featureRequest={featureRequest} />
      ))}
    </Box>
  )
}

export default Voting
