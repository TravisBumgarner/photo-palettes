'use client'

import config from '../../config'
import { createClient } from '../../services/supabase/client'

const Authed = () => {
  const handleClick = async () => {
    const supabase = await createClient()
    const session = await supabase.auth.getSession()
    const tokens = session?.data?.session?.access_token

    await fetch(config.apiUrl + '/whoami', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens}`,
      },
    })
    // const json = await response.json()
  }

  return (
    <div>
      Authed<button onClick={handleClick}>Click me</button>
    </div>
  )
}

export default Authed
