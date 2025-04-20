'use client'

import Link from 'next/link'
import useGlobalStore from '../../store'

const AuthLinks = () => {
  const user = useGlobalStore(state => state.user)

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
  const addAlert = useGlobalStore(state => state.addAlert)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: `10px 20px`,
      }}
    >
      <button onClick={() => addAlert('Hello, world!')}>Add Alert</button>
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
        <Link href="/donations">Donate</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/tos">Terms of Service</Link>
      </div>
    </div>
  )
}

export default Navigation
