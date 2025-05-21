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
import { FONT_SIZES, SPACING } from '../../styles/styleConsts'
import { EPermissionLevel, TFeatureRequest } from '../../types'
import Link from '../_sharedComponents/Link'
import Loading from '../_sharedComponents/Loading'
import Message from '../_sharedComponents/Message'
import { PageTitle, PageWrapper } from '../../styles/Shared'

const FeatureRequestCard = ({
  featureRequest,
  readonly,
  refetch,
}: {
  featureRequest: TFeatureRequest
  readonly: boolean
  refetch: () => void
}) => {
  const addAlert = useGlobalStore(store => store.addAlert)
  const appUserDetails = useGlobalStore(store => store.appUserDetails)
  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: (featureRequestId: string) => upvoteFeatureRequest(featureRequestId),
    retry: false,
    onSuccess: () => {
      refetch()
    },
  })

  const handleClick = useCallback(async () => {
    if (readonly) return

    const response = await mutateAsync(featureRequest.id)
    if (response.success) {
      addAlert('Feature request upvoted', 'success')
    } else {
      addAlert('Error upvoting feature request', 'error')
    }
  }, [mutateAsync, featureRequest.id, readonly, addAlert])

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
        <PageTitle marginBottom text={featureRequest.title} />
        <Typography variant="body1">{featureRequest.description}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
        <Box sx={{ width: '75px' }}>
          <Typography sx={{ fontSize: FONT_SIZES.LARGE.PX, textAlign: 'center' }} variant="body1">
            {featureRequest.votes.length}
          </Typography>
          <Typography sx={{ textAlign: 'center' }} variant="body1">
            Votes
          </Typography>
        </Box>
        {!readonly && (
          <Button
            sx={{ width: '110px' }}
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
        border: '4px solid',
        borderColor: 'red',
        padding: SPACING.MEDIUM.PX,
        margin: `${SPACING.MEDIUM.PX} 0`,
      }}
    >
      <PageTitle marginBottom text="Moderators Only" />
      <Box sx={{ display: 'flex', gap: SPACING.MEDIUM.PX, flexDirection: 'column' }}>
        <Typography variant="body1">Add</Typography>
        <TextField fullWidth label="Title" value={title} onChange={handleTitleChange} />
        <TextField
          fullWidth
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
    <PageWrapper width="medium">
      <PageTitle marginBottom text="Feature Requests" />
      {!appUserDetails && (
        <Typography variant="body1">
          <Link href="/login">Log in to upvote.</Link>
        </Typography>
      )}
      <Typography variant="body1">
        <Link href="/feedback">Submit a feature request.</Link>
      </Typography>
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
      {appUserDetails && appUserDetails?.permissionLevel >= EPermissionLevel.MODERATOR && (
        <NewFeatureSubmission refetch={refetch} />
      )}
    </PageWrapper>
  )
}

export default FeatureRequests
