'use client'

import { Box } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import useGlobalStore from '../../store'

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
        border: '2px solid var(--background)',
        textAlign: 'center',
        color: 'var(--background)',
        backgroundColor: 'var(--foreground)',
        padding: '4px 16px 4px 8px',
        borderRadius: 8,
        position: 'relative',
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
          color: 'var(--background)',
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
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      {visibleAlerts.map(alert => (
        <Alert key={alert.id} {...alert} handleClose={handleClose} />
      ))}
    </Box>
  )
}

export default AlertsManager
