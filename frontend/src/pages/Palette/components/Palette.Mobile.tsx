import React, { useCallback, useState } from 'react'
import { SPACING, subtleBackground } from '../../../styles/styleConsts'
import PageWrapper from '../../../styles/shared/PageWrapper'
import { useTheme } from '@mui/material/styles'
import Summary from './Summary'
import Controls from './Controls'
import type { PaletteControlsState } from '../Palette.types'
import ColorDetails from './ColorDetails'
import ModerationPanel from '../../../sharedComponents/ModerationPanel'
import { type TPalette } from '../../../types'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

const TABS = ['overview', 'color']

const TABS_LABEL = {
  [TABS[0]]: 'Overview',
  [TABS[1]]: 'Color Details',
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
  const theme = useTheme()
  const handleTabChange = useCallback((_event: unknown, v: number) => {
    setTabIndex(v)
  }, [])

  return (
    <PageWrapper width="full">
      <Tabs
        sx={{
          position: 'sticky',
          top: 0,
          marginBottom: SPACING.MEDIUM.PX,
          padding: `${SPACING.SMALL.PX} ${SPACING.MEDIUM.PX}`,
          backgroundColor: subtleBackground(theme.palette.mode),
        }}
        variant="scrollable"
        value={tabIndex}
        onChange={handleTabChange}
      >
        {TABS.map((key) => (
          <Tab key={key} label={TABS_LABEL[key]} />
        ))}
      </Tabs>

      {TABS[tabIndex] === 'overview' && (
        <Summary palette={palette} refetch={refetch} />
      )}

      {TABS[tabIndex] === 'color' && (
        <>
          <Controls controls={controls} setControls={setControls} />
          {palette.colors.map((swatch, index) => (
            <ColorDetails
              index={index}
              colorMix={controls.mix}
              details={controls.details}
              swatch={swatch}
              key={swatch.id}
            />
          ))}
        </>
      )}

      <ModerationPanel
        refetch={refetch}
        moderationStatus={palette.moderationStatus}
        paletteId={palette.id}
      />
    </PageWrapper>
  )
}

export default PaletteMobile
