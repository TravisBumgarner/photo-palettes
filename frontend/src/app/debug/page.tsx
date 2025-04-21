'use client'

import { useCallback, useState } from 'react'
import config from '../../config'
import { getToken } from '../../services/supabase/utils'

const Debug = () => {
  const [user, setUser] = useState<unknown>(null)

  const handleWhoAmI = useCallback(async () => {
    const token = await getToken()
    fetch(`${config.apiUrl}/whoami`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setUser(data)
      })
  }, [setUser])

  return (
    <div>
      <button onClick={handleWhoAmI}>Who am I?</button>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}

export default Debug
