import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Reorder } from 'framer-motion'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import addFeatureRequest from '../api/featureRequests/addFeatureRequest'
import getFeatureRequests from '../api/featureRequests/getFeatureRequests'
import upvoteFeatureRequest from '../api/featureRequests/upvoteFeatureRequst'
import Link from '../sharedComponents/Link'
import Loading from '../sharedComponents/Loading'
import Message from '../sharedComponents/Message'
import useGlobalStore from '../store'
import PageTitle from '../styles/shared/PageTitle'
import PageWrapper from '../styles/shared/PageWrapper'
import { FONT_SIZES, SPACING } from '../styles/styleConsts'
import { PERMISSION_LEVEL, type TFeatureRequest } from '../types'

const FeatureRequestCard = ({
  featureRequest,
  readonly,
  refetch,
}: {
  featureRequest: TFeatureRequest
  readonly: boolean
  refetch: () => void
}) => {
  const appUser = useGlobalStore((store) => store.appUser)
  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: (featureRequestId: string) =>
      upvoteFeatureRequest(featureRequestId),
    retry: false,
    onSuccess: () => {
      refetch()
    },
  })

  const handleClick = useCallback(async () => {
    if (readonly) return

    await mutateAsync(featureRequest.id)
  }, [mutateAsync, featureRequest.id, readonly])

  const buttonMsg = useMemo(() => {
    if (readonly) return ''
    if (isPending) return 'Upvoting...'
    if (isSuccess) return 'Upvoted'
    if (featureRequest.votes.includes(appUser?.id || '')) return 'Upvoted'
    return 'Upvote'
  }, [readonly, isPending, isSuccess, featureRequest.votes, appUser])

  if (isError) {
    return <Navigate to="/error500" />
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '75px' }}>
          <Typography
            sx={{ fontSize: FONT_SIZES.LARGE.PX, textAlign: 'center' }}
            variant="body1"
          >
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
              isPending ||
              isSuccess ||
              featureRequest.votes.includes(appUser?.id || '')
            }
            onClick={handleClick}
            variant="contained"
            color="primary"
          >
            {buttonMsg}
          </Button>
        )}
      </Box>
    </Box>
  )
}

const NewFeatureSubmission = ({ refetch }: { refetch: () => void }) => {
  const [title, setTitle] = useState('')
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)

  const [description, setDescription] = useState('')

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => addFeatureRequest(title, description),
  })

  const handleSubmitFeatureRequest = useCallback(async () => {
    const response = await mutateAsync()

    if (response.success) {
      setSuccess(true)
      setTitle('')
      setDescription('')
      refetch()
    } else {
      setFailure(true)
    }
  }, [mutateAsync, refetch])

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

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value)
    },
    []
  )

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value)
    },
    []
  )

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
      <Box
        sx={{
          display: 'flex',
          gap: SPACING.MEDIUM.PX,
          flexDirection: 'column',
        }}
      >
        <Typography variant="body1">Add</Typography>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={handleTitleChange}
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={handleDescriptionChange}
        />
        <Button
          variant="contained"
          disabled={title === '' || description === '' || isPending}
          onClick={handleSubmitFeatureRequest}
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
        {success && (
          <Message
            includeVerticalMargin
            message="Thank you for your submission!"
            color="success"
          />
        )}
        {failure && (
          <Message
            includeVerticalMargin
            message="Failed to send submission. Please try again later."
            color="error"
          />
        )}
      </Box>
    </Box>
  )
}

const FeatureRequests = () => {
  const appUser = useGlobalStore((store) => store.appUser)
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
    <PageWrapper width="full">
      <PageTitle marginBottom text="Feature Requests" />
      {!appUser && <Typography variant="body1">Log in to upvote.</Typography>}
      <Typography variant="body1">
        <Link href="/feedback">Submit a feature request.</Link>
      </Typography>
      <Box
        sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Reorder.Group
          axis="y"
          values={data.featureRequests.sort(
            (a, b) => b.votes.length - a.votes.length
          )}
          onReorder={noop}
          style={{ listStyle: 'none', padding: 0 }}
        >
          {data.featureRequests
            .sort((a, b) => b.votes.length - a.votes.length)
            .map((featureRequest) => (
              <Reorder.Item
                key={featureRequest.id}
                value={featureRequest}
                drag={false}
              >
                <FeatureRequestCard
                  readonly={!appUser}
                  featureRequest={featureRequest}
                  refetch={refetch}
                />
              </Reorder.Item>
            ))}
        </Reorder.Group>
      </Box>
      {appUser && appUser?.permissionLevel >= PERMISSION_LEVEL.MODERATOR && (
        <NewFeatureSubmission refetch={refetch} />
      )}
    </PageWrapper>
  )
}

export default FeatureRequests
