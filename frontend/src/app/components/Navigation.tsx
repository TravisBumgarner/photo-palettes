'use client'

import Link from 'next/link'
import config from '../../config'
import useGlobalStore from '../../store'

const AuthLinks = () => {
  const user = useGlobalStore(state => state.user)

  if (!config.showNavigation) {
    return null
  }

  return (
    <>
      {user ? (
        <Link href="/logout">Logout</Link>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </>
      )}
    </>
  )
}

const Navigation = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: `10px 20px`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '14px',
        }}
      >
        <Link href="/">Home</Link>
        <AuthLinks />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '14px',
        }}
      >
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/tos">Terms of Service</Link>
      </div>
    </div>
  )
}

export default Navigation
