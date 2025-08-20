import { Box, Tooltip, Button } from '@mui/material'
import {
  BlueskyIcon,
  BlueskyShareButton,
  PinterestIcon,
  PinterestShareButton,
  ThreadsIcon,
  ThreadsShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'
import { SPACING } from '../../styles/styleConsts'
import { useCallback } from 'react'
import useGlobalStore from '../../store'

const ICON_SIZE = 32

const CopyLink = ({ url }: { url: string }) => {
  const addAlert = useGlobalStore(store => store.addAlert)

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(url)
    addAlert('Link copied to clipboard', 'success')
  }, [url, addAlert])

  return (
    <Tooltip title="Copy Link" arrow>
      <Button
        variant="contained"
        onClick={copyToClipboard}
        sx={{
          '&:hover': {
            boxShadow: 'none',
          },
          color: 'primary.main',
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

const Share = ({ url, text, media }: { url: string; text: string; media: string }) => {
  const absoluteUrl = process.env.NEXT_PUBLIC_FE_URL + '/' + url

  return (
    <Box
      sx={{
        display: 'flex',
        gap: SPACING.SMALL.PX,
        '& svg > rect': { fill: theme => theme.palette.divider },
        '& svg > path': { fill: theme => theme.palette.primary.main },
      }}
    >
      <Tooltip title="Copy Link" arrow>
        <CopyLink url={absoluteUrl} />
      </Tooltip>

      <Tooltip title="Share on Pinterest" arrow>
        <PinterestShareButton url={absoluteUrl} media={media} description={text}>
          <PinterestIcon size={ICON_SIZE} />
        </PinterestShareButton>
      </Tooltip>

      <Tooltip title="Share on Bluesky" arrow sx={{ borderRadius: '0%' }}>
        <BlueskyShareButton
          url={absoluteUrl}
          title={`${text}\n#photopalettes #colorpalettes #color`}
        >
          <BlueskyIcon size={ICON_SIZE} />
        </BlueskyShareButton>
      </Tooltip>

      <Tooltip title="Share on Twitter" arrow>
        <TwitterShareButton
          url={absoluteUrl}
          title={text}
          hashtags={['palette', 'color', 'photopalette']}
        >
          <TwitterIcon size={ICON_SIZE} />
        </TwitterShareButton>
      </Tooltip>

      {/* Not working */}
      {/* <Tooltip title="Share on Facebook" arrow>
        <FacebookShareButton url={absoluteUrl}>
          <FacebookIcon size={ICON_SIZE} />
        </FacebookShareButton>
      </Tooltip> */}

      <Tooltip title="Share on Threads" arrow>
        <ThreadsShareButton url={absoluteUrl} title={text}>
          <ThreadsIcon size={ICON_SIZE} />
        </ThreadsShareButton>
      </Tooltip>

      {/* Not currently working. */}
      {/* <Tooltip title="Share on Reddit" arrow>
        <RedditShareButton url={absoluteUrl} title={text}>
          <RedditIcon size={ICON_SIZE} />
        </RedditShareButton>
      </Tooltip> */}
    </Box>
  )
}

export default Share
