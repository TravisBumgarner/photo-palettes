'use client'

import { Box, Button, TextField, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Reorder } from 'framer-motion'
import { redirect } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import addFeatureRequest from '../../api/featureRequests/addFeatureRequest'
import getFeatureRequests from '../../api/featureRequests/getFeatureRequests'
import upvoteFeatureRequest from '../../api/featureRequests/upvoteFeatureRequst'
import useGlobalStore from '../../store'
import { SPACING } from '../../styles/Theme'
import { EPermissionLevel, TFeatureRequest } from '../../types'
import Link from '../sharedComponents/Link'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'

const FeatureRequestCard = ({
  featureRequest,
  readonly,
  refetch,
}: {
  featureRequest: TFeatureRequest
  readonly: boolean
  refetch: () => void
}) => {
  const appUserDetails = useGlobalStore(store => store.appUserDetails)
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (featureRequestId: string) => upvoteFeatureRequest(featureRequestId),
    retry: false,
    onSuccess: () => {
      refetch()
    },
  })

  const handleClick = useCallback(() => {
    if (readonly) return

    mutate(featureRequest.id)
  }, [mutate, featureRequest.id, readonly])

  if (isError) {
    return redirect('/error500')
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        padding: SPACING.MEDIUM.PX,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: `${SPACING.MEDIUM.PX} 0`,
      }}
    >
      <Box>
        <Typography variant="h2">{featureRequest.title}</Typography>
        <Typography variant="body1">{featureRequest.description}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Typography variant="body1">Votes: {featureRequest.votes.length}</Typography>
        {!readonly && (
          <Button
            disabled={
              isPending || isSuccess || featureRequest.votes.includes(appUserDetails?.id || '')
            }
            onClick={handleClick}
            variant="contained"
            color="primary"
          >
            {isPending ? 'Upvoting...' : 'Upvote'}
          </Button>
        )}
      </Box>
    </Box>
  )
}

const NewFeatureSubmission = ({ refetch }: { refetch: () => void }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const addAlert = useGlobalStore(store => store.addAlert)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => addFeatureRequest(title, description),
    onSuccess: () => {
      addAlert('Feature request submitted', 'success')
      setTitle('')
      setDescription('')
      refetch()
    },
  })

  const handleSubmitFeatureRequest = useCallback(async () => {
    await mutateAsync()
  }, [mutateAsync])

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }, [])

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }, [])

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        padding: SPACING.MEDIUM.PX,
      }}
    >
      <Typography variant="h2">Moderators Only</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
        <Typography variant="body1">Add</Typography>
        <TextField label="Title" value={title} onChange={handleTitleChange} />
        <TextField
          sx={{ flexGrow: 1 }}
          label="Description"
          value={description}
          onChange={handleDescriptionChange}
        />
        <Button
          disabled={title === '' || description === '' || isPending}
          onClick={handleSubmitFeatureRequest}
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Box>
  )
}

const FeatureRequests = () => {
  const appUserDetails = useGlobalStore(store => store.appUserDetails)
  const noop = useCallback(() => {}, [])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['feature_requests'],
    queryFn: getFeatureRequests,
    retry: false,
  })

  if (isLoading) {
    return <Loading />
  }

  if (error || !data?.success) {
    return <Message message="Error fetching feature requests" color="error" />
  }

  return (
    <Box>
      <Typography variant="h1">Feature Requests</Typography>
      <Typography variant="body1">
        Want to discuss or suggest a feature? <Link href="/feedback">Click here</Link>
      </Typography>
      {appUserDetails && appUserDetails?.permissionLevel >= EPermissionLevel.MODERATOR && (
        <NewFeatureSubmission refetch={refetch} />
      )}
      <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Reorder.Group
          axis="y"
          values={data.featureRequests.sort((a, b) => b.votes.length - a.votes.length)}
          onReorder={noop}
          style={{ listStyle: 'none', padding: 0 }}
        >
          {data.featureRequests
            .sort((a, b) => b.votes.length - a.votes.length)
            .map(featureRequest => (
              <Reorder.Item key={featureRequest.id} value={featureRequest} drag={false}>
                <FeatureRequestCard
                  readonly={!appUserDetails}
                  featureRequest={featureRequest}
                  refetch={refetch}
                />
              </Reorder.Item>
            ))}
        </Reorder.Group>
      </Box>
    </Box>
  )
}

export default FeatureRequests
