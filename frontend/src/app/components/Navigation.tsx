'use client'

import Link from 'next/link'
import config from '../../config'
import useGlobalStore from '../../store'

const Navigation = () => {
  const user = useGlobalStore(state => state.user)

  if (!config.showNavigation) {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: '14px',
      }}
    >
      <Link href="/">Home</Link>
      {user ? (
        <Link href="/logout">Logout</Link>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </>
      )}
    </div>
  )
}

export default Navigation
