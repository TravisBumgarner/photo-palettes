import { useEffect, useState } from 'react'

// For whatever reason, useMediaQuery from MUI isn't working properly in Palette.tsx
// So I'm making my own simple version here cause chatGPT is super confused.
export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    setMatches(media.matches)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}
