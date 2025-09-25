import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React, { useCallback, useState } from 'react'
import BlurImage from '../../../sharedComponents/BlurImage'
import ColorBar from '../../../sharedComponents/ColorBar'
import ModerationPanel from '../../../sharedComponents/ModerationPanel'
import PageWrapper from '../../../styles/shared/PageWrapper'
import { SPACING, subtleBackground } from '../../../styles/styleConsts'
import { type TPalette } from '../../../types'
import type { PaletteControlsState } from '../Palette.types'
import ColorDetails from './ColorDetails'
import Controls from './Controls'
import Summary from './Summary'

const TABS = ['photo', 'color']

const TABS_LABEL = {
  [TABS[0]]: 'Photo',
  [TABS[1]]: 'Color Exploration',
}

const PaletteMobile = ({
  palette,
  refetch,
  controls,
  setControls,
}: {
  palette: TPalette
  refetch: () => void
  controls: PaletteControlsState
  setControls: React.Dispatch<React.SetStateAction<PaletteControlsState>>
}) => {
  const [tabIndex, setTabIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const theme = useTheme()
  const handleTabChange = useCallback((_event: unknown, v: number) => {
    setTabIndex(v)
  }, [])

  const handleFilterToggle = useCallback(() => {
    setShowFilters((prev) => !prev)
  }, [])

  return (
    <PageWrapper width="full">
      <Summary isMobile palette={palette} refetch={refetch} />

      <Tabs
        sx={{
          marginBottom: SPACING.MEDIUM.PX,
        }}
        variant="scrollable"
        value={tabIndex}
        onChange={handleTabChange}
      >
        {TABS.map((key) => (
          <Tab key={key} label={TABS_LABEL[key]} />
        ))}
      </Tabs>

      {TABS[tabIndex] === 'photo' && (
        <BlurImage
          alt={`${name} thumbnail`}
          src={palette.photoUrl}
          aspectRatio={palette.aspectRatio}
          blurHash={palette.blurhash}
          maxDimensions={{ maxHeight: '90vh' }}
        />
      )}

      {TABS[tabIndex] === 'color' && (
        <>
          <Box
            sx={{
              position: 'sticky',
              top: 'env(safe-area-inset-top)',
              zIndex: 999,
              padding: SPACING.SMALL.PX,
              backgroundColor: subtleBackground(theme.palette.mode, 'slightly'),
              gap: SPACING.SMALL.PX,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ColorBar
              interactive
              height={25}
              colors={palette.colors.map((c) => c.hex)}
            />

            <Button variant="contained" fullWidth onClick={handleFilterToggle}>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>

            {showFilters && (
              <Box
                sx={{
                  backgroundColor: subtleBackground(theme.palette.mode),
                  padding: SPACING.MEDIUM.PX,
                  marginBottom: SPACING.MEDIUM.PX,
                  borderRadius: 1,
                }}
              >
                <Controls setControls={setControls} controls={controls} />
              </Box>
            )}
          </Box>
          <Box sx={{ backgroundColor: controls.background }}>
            {palette.colors.map((swatch, index) => (
              <ColorDetails
                index={index}
                colorMix={controls.mix}
                details={controls.details}
                swatch={swatch}
                key={swatch.id}
              />
            ))}
          </Box>
        </>
      )}
      <ModerationPanel
        refetch={refetch}
        moderationStatus={palette.moderationStatus}
        palette={palette}
      />
    </PageWrapper>
  )
}

export default PaletteMobile
