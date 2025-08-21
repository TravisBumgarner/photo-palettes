'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Redirect({ to }: { to: string }) {
  const router = useRouter()

  useEffect(() => {
    router.replace(to)
  }, [to, router])

  return null
}
