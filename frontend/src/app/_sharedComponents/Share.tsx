import { Box, Tooltip, Button } from '@mui/material'
import {
  BlueskyIcon,
  BlueskyShareButton,
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  ThreadsIcon,
  ThreadsShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'
import { SPACING } from '../../styles/styleConsts'
import { useCallback } from 'react'

const ICON_SIZE = 32

const CopyLink = ({ url }: { url: string }) => {
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }, [url])

  return (
    <Tooltip title="Copy Link" arrow>
      <Button
        variant="contained"
        onClick={copyToClipboard}
        sx={{
          '&:hover': {
            boxShadow: 'none',
          },
          color: 'text.primary',
          boxShadow: 'none',
          padding: `0 ${SPACING.TINY.PX}`,
          height: ICON_SIZE,
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
          backgroundColor: 'divider',
        }}
      >
        Copy Link
      </Button>
    </Tooltip>
  )
}

const Share = ({ url }: { url: string }) => {
  return (
    <Box sx={{ display: 'flex', gap: SPACING.SMALL.PX }}>
      <Tooltip title="Copy Link" arrow>
        <CopyLink url={url} />
      </Tooltip>

      <Tooltip title="Share on Bluesky" arrow sx={{ borderRadius: '0%' }}>
        <BlueskyShareButton url={url}>
          <BlueskyIcon size={ICON_SIZE} />
        </BlueskyShareButton>
      </Tooltip>

      <Tooltip title="Share on Twitter" arrow>
        <TwitterShareButton url={url}>
          <TwitterIcon size={ICON_SIZE} />
        </TwitterShareButton>
      </Tooltip>

      <Tooltip title="Share on Facebook" arrow>
        <FacebookShareButton url={url}>
          <FacebookIcon size={ICON_SIZE} />
        </FacebookShareButton>
      </Tooltip>

      <Tooltip title="Share on Threads" arrow>
        <ThreadsShareButton url={url}>
          <ThreadsIcon size={ICON_SIZE} />
        </ThreadsShareButton>
      </Tooltip>

      <Tooltip title="Share on Reddit" arrow>
        <RedditShareButton url={url}>
          <RedditIcon size={ICON_SIZE} />
        </RedditShareButton>
      </Tooltip>

      <Tooltip title="Share via Email" arrow>
        <EmailShareButton
          url={url}
          subject={'Check out this link!'}
          body={'I found this link and thought you might like it!'}
        >
          <EmailIcon size={ICON_SIZE} />
        </EmailShareButton>
      </Tooltip>
    </Box>
  )
}

export default Share
