'use client'

import { Box } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import useGlobalStore from '../store'
import { type TAlert } from '../store/types'
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '../styles/styleConsts'

const Alert = ({
  id,
  message,
  handleClose,
  color,
}: {
  id: number
  message: string
  handleClose: (id: number) => void
  color: 'info' | 'error' | 'success'
}) => {
  const handleCloseClick = useCallback(() => handleClose(id), [handleClose, id])

  return (
    <Box
      key={message}
      sx={{
        border: `4px solid`,
        borderColor: `${color}.main`,
        textAlign: 'center',
        color: `${color}.main`,
        fontSize: FONT_SIZES.LARGE.PX,
        fontWeight: 700,
        backgroundColor: 'background.paper',
        minWidth: '300px',
        maxWidth: '500px',
        padding: `${SPACING.MEDIUM.PX} ${SPACING.LARGE.PX}`,
        borderRadius: BORDER_RADIUS.ZERO.PX,
        position: 'relative',
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      {message}
      <span
        onClick={handleCloseClick}
        style={{
          position: 'absolute',
          top: 2,
          right: 8,
          cursor: 'pointer',
          fontWeight: 'bold',
          color: 'text.primary',
          fontSize: FONT_SIZES.LARGE.PX,
        }}
      >
        &times;
      </span>
    </Box>
  )
}

const AlertsManager = () => {
  const alerts = useGlobalStore((state) => state.alerts)
  const getAndRemoveNextAlert = useGlobalStore(
    (state) => state.getAndRemoveNextAlert
  )
  const [visibleAlerts, setVisibleAlerts] = useState<TAlert[]>([])
  const nextIdRef = useRef(0)

  const handleClose = useCallback((id: number) => {
    setVisibleAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  useEffect(() => {
    if (alerts.length > 0) {
      const nextAlert = getAndRemoveNextAlert()
      if (nextAlert) {
        const newAlert = {
          id: nextIdRef.current++,
          message: nextAlert.message,
          color: nextAlert.color,
        }
        setVisibleAlerts((prev) => [...prev, newAlert])

        setTimeout(() => {
          setVisibleAlerts((prev) =>
            prev.filter((alert) => alert.id !== newAlert.id)
          )
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
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        '@keyframes slideDown': {
          from: {
            transform: 'translateY(-100%)',
            opacity: 0,
          },
          to: {
            transform: 'translateY(0%)',
            opacity: 1,
          },
        },
      }}
    >
      {visibleAlerts.map((alert) => (
        <Alert key={alert.id} {...alert} handleClose={handleClose} />
      ))}
    </Box>
  )
}

export default AlertsManager
