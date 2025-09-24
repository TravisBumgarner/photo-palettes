import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackEvent } from '../services/analytics'

const useParseAnalyticsFromUrl = () => {
  const { search } = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(search)
    const source = params.get('source')

    if (source) {
      trackEvent({ event: 'user_origin', properties: { source } })
      params.delete('source')
      const newSearch = params.toString()
      const newUrl =
        window.location.pathname + (newSearch ? `?${newSearch}` : '')
      window.history.replaceState({}, '', newUrl)
    }
  }, [search])
}

export default useParseAnalyticsFromUrl
