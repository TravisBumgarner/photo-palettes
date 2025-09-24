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
  id: typeof MODAL_ID.MODERATOR_SHARE_POST_TO_SOCIALS
  palette: TPalette
}

const ModeratorSharePostToSocials = ({
  palette,
}: ModeratorSharePostToSocialsProps) => {
  const [shareToBluesky, setShareToBluesky] = useState(false)
  const [shareToInstagram, setShareToInstagram] = useState(false)
  const [blueskyHashtags, setBlueskyHashtags] = useState('')
  const [instagramHashtags, setInstagramHashtags] = useState('')
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

  return (
    <DefaultModal closeCallback={handleCloseCallback}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: SPACING.TINY.PX }}
      >
        <img
          style={{ objectFit: 'contain', maxHeight: '200px', width: '100%' }}
          src={palette.photoUrl}
          alt="photo"
        />
        <ColorBar colors={colors} height={10} />
        <Typography variant="body1">Share this palette</Typography>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={shareToBluesky}
                onChange={() => setShareToBluesky(!shareToBluesky)}
              />
            }
            label="Share to Bluesky"
          />
        </FormGroup>
        {shareToBluesky && (
          <TextField
            label="Bluesky Hashtags (Space separated, no #)"
            variant="outlined"
            multiline
            rows={2}
            fullWidth
            value={blueskyHashtags}
            onChange={(e) => setBlueskyHashtags(e.target.value)}
          />
        )}
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={shareToInstagram}
                onChange={() => setShareToInstagram(!shareToInstagram)}
              />
            }
            label="Share to Instagram"
          />
        </FormGroup>
        {shareToInstagram && (
          <TextField
            label="Instagram Hashtags (Space separated, no #)"
            variant="outlined"
            multiline
            rows={2}
            fullWidth
            value={instagramHashtags}
            onChange={(e) => setInstagramHashtags(e.target.value)}
          />
        )}
        <TextField
          label="Caption"
          variant="outlined"
          multiline
          rows={3}
          fullWidth
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <Button variant="contained" onClick={handleConfirm}>
          Submit
        </Button>
      </Box>
    </DefaultModal>
  )
}

export default ModeratorSharePostToSocials
