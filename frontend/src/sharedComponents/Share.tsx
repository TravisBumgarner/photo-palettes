import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'

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
import {
  DARK_BUTTON_STYLES,
  LIGHT_BUTTON_STYLES,
  SPACING,
} from '../styles/styleConsts'
import { useCallback } from 'react'
import config from '../config'

const ICON_SIZE = 32

const CopyLink = ({ url }: { url: string }) => {
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(url)
  }, [url])

  return (
    <Tooltip title="Copy Link" arrow>
      <Button
        variant="contained"
        onClick={copyToClipboard}
        sx={{
          height: ICON_SIZE,
        }}
      >
        Copy Link
      </Button>
    </Tooltip>
  )
}

const Share = ({
  url,
  text,
  media,
}: {
  url: string
  text: string
  media: string
}) => {
  const absoluteUrl = config.frontendUrl + '/' + url

  return (
    <Box
      sx={{
        display: 'flex',
        gap: SPACING.SMALL.PX,
        '& svg > rect': {
          fill: (theme) =>
            theme.palette.mode === 'dark'
              ? DARK_BUTTON_STYLES.background
              : LIGHT_BUTTON_STYLES.background,
        },
        'svg:hover > rect': {
          fill: (theme) =>
            theme.palette.mode === 'dark'
              ? DARK_BUTTON_STYLES.hoverBackground
              : LIGHT_BUTTON_STYLES.hoverBackground,
        },
        '& svg > path': {
          fill: (theme) =>
            theme.palette.mode === 'dark'
              ? DARK_BUTTON_STYLES.color
              : LIGHT_BUTTON_STYLES.color,
        },
      }}
    >
      <Tooltip title="Copy Link" arrow>
        <CopyLink url={absoluteUrl} />
      </Tooltip>

      <Tooltip title="Share on Pinterest" arrow>
        <PinterestShareButton
          url={absoluteUrl}
          media={media}
          description={text}
        >
          <PinterestIcon size={ICON_SIZE} />
        </PinterestShareButton>
      </Tooltip>

      <Tooltip title="Share on Bluesky" arrow sx={{ borderRadius: '0%' }}>
        <div>
          {/* Tooltip gets big mad if a child has a title prop */}
          <BlueskyShareButton
            url={absoluteUrl}
            title={`${text}\n#photopalettes #colorpalettes #color`}
          >
            <BlueskyIcon size={ICON_SIZE} />
          </BlueskyShareButton>
        </div>
      </Tooltip>

      <Tooltip title="Share on Twitter" arrow>
        <div>
          {/* Tooltip gets big mad if a child has a title prop */}
          <TwitterShareButton
            url={absoluteUrl}
            title={text}
            hashtags={['palette', 'color', 'photopalette']}
          >
            <TwitterIcon size={ICON_SIZE} />
          </TwitterShareButton>
        </div>
      </Tooltip>

      {/* Not working */}
      {/* <Tooltip title="Share on Facebook" arrow>
        <FacebookShareButton url={absoluteUrl}>
          <FacebookIcon size={ICON_SIZE} />
        </FacebookShareButton>
      </Tooltip> */}

      <Tooltip title="Share on Threads" arrow>
        <div>
          {/* Tooltip gets big mad if a child has a title prop */}
          <ThreadsShareButton url={absoluteUrl} title={text}>
            <ThreadsIcon size={ICON_SIZE} />
          </ThreadsShareButton>
        </div>
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
