import { useMemo } from 'react'
import type { SxProps } from '@mui/material/styles'

import { Capacitor } from '@capacitor/core'
import Box from '@mui/system/Box'

const PlatformSpecificStyling = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const styles = useMemo((): SxProps => {
    if (Capacitor.getPlatform() === 'ios') {
      return {
        padding:
          'env(safe-area-inset-top) 10px env(safe-area-inset-bottom) 10px',
        minHeight: '100vh',
      }
    }

    if (Capacitor.getPlatform() === 'android') {
      return {
        // It appears android needs to be handled differently than iOS but I don't care for Android for now.
        padding: '10px',
      }
    }

    return {
      padding: '10px',
    }
  }, [])

  return <Box sx={styles}>{children}</Box>
}

export default PlatformSpecificStyling
