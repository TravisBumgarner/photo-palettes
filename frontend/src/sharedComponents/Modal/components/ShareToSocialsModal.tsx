import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import type { SxProps } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useCallback, useState } from 'react'
import { shareToSocials } from '../../../api/moderation/shareToSocials'
import { activeModalSignal } from '../../../signals'
import { SPACING } from '../../../styles/styleConsts'
import type { TPalette } from '../../../types'
import ColorBar from '../../ColorBar'
import { type MODAL_ID } from '../Modal.consts'
import DefaultModal from './DefaultModal'

export interface ModeratorSharePostToSocialsProps {
  id: typeof MODAL_ID.SHARE_TO_SOCIALS_MODAL
  palette: TPalette
}

// I'm not sure I want to go down the same road for tagging as I did @cameracoffeewander.
// I think that's perhaps how I got shadowbanned. Could be interesting to rely on ChatGPT
// to generate tags based on the image.

const shouldPostTag = (tag: string, probability: number = 0.2) => {
  // Instagram claims that using the same hashtags can lead to shadowbanning.
  // Also, for tags that are feeds, let's not blow them up.
  if (Math.random() < probability) {
    return `${tag}`
  }
  return ''
}

const PROMPT = `Look at this image and generate tags and captions.

Give me exactly 5 tags for Twitter, 5 for Bluesky, and 5 for Instagram. These tags should be moderately popular and related to the photo and Photo Palettes as a color palette generation tool. Do not recommend results with zero usages.

The tags for each platform must be output as a single line inside a fenced Markdown code block. (Example: tag1 tag2 tag3 tag4 tag5 )

After the tags, write exactly 3 captions. Each caption must be a separate fenced Markdown code block, containing only one sentence.

Do not include hashtags (#).

Label each section clearly as Twitter, Bluesky, Instagram, and Captions.

Do not add any explanations or extra text outside of what’s specified.`

const getBlueskyHashtags = () => {
  const hashTags: string[] = [shouldPostTag('designsky', 0.3)].filter((a) => a)

  return hashTags.join(' ')
}

const getInstagramHashtags = () => {
  const hashTags: string[] = []

  return hashTags.join(' ')
}

const getTwitterHashtags = () => {
  const hashTags: string[] = []

  return hashTags.join(' ')
}

const ModeratorSharePostToSocials = ({
  palette,
}: ModeratorSharePostToSocialsProps) => {
  const [shareToBluesky, setShareToBluesky] = useState(true)
  const [shareToInstagram, setShareToInstagram] = useState(true)
  const [shareToTwitter, setShareToTwitter] = useState(true)
  const [blueskyHashtags, setBlueskyHashtags] = useState(getBlueskyHashtags())
  const [instagramHashtags, setInstagramHashtags] =
    useState(getInstagramHashtags)
  const [twitterHashtags, setTwitterHashtags] = useState(getTwitterHashtags())
  const [caption, setCaption] = useState('')

  const colors = palette.colors.map((swatch) => swatch.hex)

  const handleConfirm = useCallback(async () => {
    const result = await shareToSocials({
      paletteId: palette.id,
      shareToBluesky,
      shareToInstagram,
      blueskyHashtags,
      instagramHashtags,
      caption,
      shareToTwitter,
      twitterHashtags,
    })

    if (result.success) {
      alert('Successfully shared to socials!') // eslint-disable-line no-alert
      activeModalSignal.value = null
    } else {
      alert(`Failed to share to socials: ${result.message || 'Unknown error'}`) // eslint-disable-line no-alert
    }
  }, [
    palette.id,
    shareToBluesky,
    shareToInstagram,
    blueskyHashtags,
    instagramHashtags,
    caption,
    shareToTwitter,
    twitterHashtags,
  ])

  const handleCloseCallback = useCallback(() => {
    activeModalSignal.value = null
  }, [])

  const copyAIPrompt = useCallback(async () => {
    try {
      // Always include the text
      const items: Record<string, Blob> = {
        'text/plain': new Blob([PROMPT], { type: 'text/plain' }),
      }

      // Try to fetch and convert the image to PNG (since JPEG usually isn't supported)
      const response = await fetch(palette.photoUrl)
      const blob = await response.blob()

      if (blob.type === 'image/png') {
        items['image/png'] = blob
      } else {
        // Convert JPEG → PNG if needed
        const bitmap = await createImageBitmap(blob)
        const canvas = document.createElement('canvas')
        canvas.width = bitmap.width
        canvas.height = bitmap.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(bitmap, 0, 0)
        const pngBlob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b as Blob), 'image/png')
        )
        items['image/png'] = pngBlob
      }

      await navigator.clipboard.write([new ClipboardItem(items)])
      window.open('https://chat.openai.com/', '_blank') // Open ChatGPT in a new tab
    } catch (err) {
      console.error('Failed to copy prompt and image', err) // eslint-disable-line no-console
      // eslint-disable-next-line no-alert
      alert(
        'You are probably trying to copy an image on localhost and that will Error. Use cloudinary. Your browser only supports copying text. Image copy failed.'
      )
    }
  }, [palette.photoUrl])

  const readyToSubmitToBlueSky =
    !shareToBluesky || blueskyHashtags.trim() !== ''
  const readyToSubmitToInstagram =
    !shareToInstagram || instagramHashtags.trim() !== ''
  const readyToSubmitToTwitter =
    !shareToTwitter || twitterHashtags.trim() !== ''
  const submitDisabled =
    !readyToSubmitToBlueSky ||
    !readyToSubmitToInstagram ||
    !readyToSubmitToTwitter

  return (
    <DefaultModal closeCallback={handleCloseCallback} sx={{ width: '800px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.MEDIUM.PX,
        }}
      >
        <img
          style={{ objectFit: 'contain', maxHeight: '170px', width: '100%' }}
          src={palette.photoUrl}
          alt="photo"
        />
        <ColorBar colors={colors} height={10} />
        <Typography variant="body1">Share this palette</Typography>
        <Button variant="outlined" onClick={copyAIPrompt}>
          Copy Image + Prompt to generate tags in AI
        </Button>
        <Box sx={{ display: 'flex', gap: SPACING.MEDIUM.PX }}>
          <Box sx={tagsSectionSX}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    sx={{ marginLeft: SPACING.SMALL.PX }}
                    checked={shareToTwitter}
                    onChange={() => setShareToTwitter(!shareToTwitter)}
                  />
                }
                label="Share to Twitter"
              />
            </FormGroup>
            <TextField
              label="Twitter Hashtags"
              variant="outlined"
              multiline
              disabled={!shareToTwitter}
              rows={4}
              fullWidth
              value={twitterHashtags}
              onChange={(e) => setTwitterHashtags(e.target.value)}
            />
          </Box>
          <Box sx={tagsSectionSX}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    sx={{ marginLeft: SPACING.SMALL.PX }}
                    checked={shareToBluesky}
                    onChange={() => setShareToBluesky(!shareToBluesky)}
                  />
                }
                label="Share to Bluesky"
              />
            </FormGroup>
            <TextField
              label="Bluesky Hashtags"
              variant="outlined"
              multiline
              disabled={!shareToBluesky}
              rows={4}
              fullWidth
              value={blueskyHashtags}
              onChange={(e) => setBlueskyHashtags(e.target.value)}
            />
          </Box>
          <Box sx={tagsSectionSX}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    sx={{ marginLeft: SPACING.SMALL.PX }}
                    checked={shareToInstagram}
                    onChange={() => setShareToInstagram(!shareToInstagram)}
                  />
                }
                label="Share to Instagram"
              />
            </FormGroup>
            <TextField
              label="Instagram Hashtags"
              variant="outlined"
              multiline
              disabled={!shareToInstagram}
              rows={4}
              fullWidth
              value={instagramHashtags}
              onChange={(e) => setInstagramHashtags(e.target.value)}
            />
          </Box>
        </Box>
        <Typography>{palette.name}</Typography>
        <TextField
          size="small"
          label="Caption (Optional)"
          variant="outlined"
          multiline
          rows={2}
          fullWidth
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <Button
          size="small"
          disabled={submitDisabled}
          variant="contained"
          onClick={handleConfirm}
        >
          Queue Posts
        </Button>
      </Box>
    </DefaultModal>
  )
}

const tagsSectionSX: SxProps = {
  flex: 1,
  display: 'flex',
  gap: SPACING.TINY.PX,
  flexDirection: 'column',
}

export default ModeratorSharePostToSocials
