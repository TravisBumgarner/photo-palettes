import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useCallback, useState } from 'react'
import { shareToSocials } from '../../../api/moderation/shareToSocials'
import { activeModalSignal } from '../../../signals'
import { SPACING } from '../../../styles/styleConsts'
import type { TPalette } from '../../../types'
import ColorBar from '../../ColorBar'
import { type MODAL_ID } from '../Modal.types'
import DefaultModal from './DefaultModal'

export interface ModeratorSharePostToSocialsProps {
  id: typeof MODAL_ID.SHARE_TO_SOCIALS
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

const PROMPT =
  'Give me 5 social media tags for Instagram, Bluesky, Instagram. No hashtag. Make it copyable in a single line for the photo.'

const getBlueskyHashtags = () => {
  const hashTags: string[] = [shouldPostTag('designsky', 0.3)].filter((a) => a)

  return hashTags.join(' ')
}

const getInstagramHashtags = () => {
  const hashTags: string[] = []

  return hashTags.join(' ')
}

const ModeratorSharePostToSocials = ({
  palette,
}: ModeratorSharePostToSocialsProps) => {
  const [shareToBluesky, setShareToBluesky] = useState(false)
  const [shareToInstagram, setShareToInstagram] = useState(false)
  const [blueskyHashtags, setBlueskyHashtags] = useState(getBlueskyHashtags())
  const [instagramHashtags, setInstagramHashtags] =
    useState(getInstagramHashtags)
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
    } catch (err) {
      console.error('Failed to copy prompt and image', err) // eslint-disable-line no-console
      alert('Your browser only supports copying text. Image copy failed.') // eslint-disable-line no-alert
    }
  }, [palette.photoUrl])

  const readyToSubmitToBlueSky =
    !shareToBluesky || blueskyHashtags.trim() !== ''
  const readyToSubmitToInstagram =
    !shareToInstagram || instagramHashtags.trim() !== ''
  const submitDisabled = !readyToSubmitToBlueSky || !readyToSubmitToInstagram

  return (
    <DefaultModal closeCallback={handleCloseCallback}>
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
          Copy Image + Prompt to AI
        </Button>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                sx={{ marginLeft: SPACING.SMALL.PX }}
                size="small"
                checked={shareToBluesky}
                onChange={() => setShareToBluesky(!shareToBluesky)}
              />
            }
            label="Share to Bluesky"
          />
        </FormGroup>
        <TextField
          size="small"
          label="Bluesky Hashtags (Space separated, no #)"
          variant="outlined"
          multiline
          disabled={!shareToBluesky}
          rows={2}
          fullWidth
          value={blueskyHashtags}
          onChange={(e) => setBlueskyHashtags(e.target.value)}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                sx={{ marginLeft: SPACING.SMALL.PX }}
                size="small"
                checked={shareToInstagram}
                onChange={() => setShareToInstagram(!shareToInstagram)}
              />
            }
            label="Share to Instagram"
          />
        </FormGroup>
        <TextField
          size="small"
          label="Instagram Hashtags (Space separated, no #)"
          variant="outlined"
          multiline
          disabled={!shareToInstagram}
          rows={2}
          fullWidth
          value={instagramHashtags}
          onChange={(e) => setInstagramHashtags(e.target.value)}
        />
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
          Submit
        </Button>
      </Box>
    </DefaultModal>
  )
}

export default ModeratorSharePostToSocials
