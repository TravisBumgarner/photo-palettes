'use client'

import { Box } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import useGlobalStore from '../../store'
import { PALETTE } from '../../styles/Theme'

const Alert = ({
  id,
  message,
  handleClose,
}: {
  id: number
  message: string
  handleClose: (id: number) => void
}) => {
  const handleCloseClick = useCallback(() => handleClose(id), [handleClose, id])

  return (
    <div
      key={id}
      style={{
        border: `2px solid ${PALETTE.secondary[500]}`,
        textAlign: 'center',
        color: PALETTE.grayscale[900],
        backgroundColor: PALETTE.grayscale[50],
        padding: '16px 16px 16px 8px',
        borderRadius: 8,
        position: 'relative',
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      {message}
      <span
        onClick={handleCloseClick}
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          cursor: 'pointer',
          fontWeight: 'bold',
          color: PALETTE.grayscale[900],
        }}
      >
        &times;
      </span>
    </div>
  )
}

const AlertsManager = () => {
  const alerts = useGlobalStore(state => state.alerts)
  const getAndRemoveNextAlert = useGlobalStore(state => state.getAndRemoveNextAlert)
  const [visibleAlerts, setVisibleAlerts] = useState<{ id: number; message: string }[]>([])
  const nextIdRef = useRef(0)

  const handleClose = useCallback((id: number) => {
    setVisibleAlerts(prev => prev.filter(alert => alert.id !== id))
  }, [])

  useEffect(() => {
    if (alerts.length > 0) {
      const nextAlert = getAndRemoveNextAlert()
      if (nextAlert) {
        const newAlert = {
          id: nextIdRef.current++,
          message: nextAlert,
        }
        setVisibleAlerts(prev => [...prev, newAlert])

        setTimeout(() => {
          setVisibleAlerts(prev => prev.filter(alert => alert.id !== newAlert.id))
        }, 5_000)
      }
    }
  }, [alerts, getAndRemoveNextAlert])

  if (visibleAlerts.length === 0) return null

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        '@keyframes slideUp': {
          from: {
            transform: 'translateY(100%)',
            opacity: 0,
          },
          to: {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
      }}
    >
      {visibleAlerts.map(alert => (
        <Alert key={alert.id} {...alert} handleClose={handleClose} />
      ))}
    </Box>
  )
}

export default AlertsManager
