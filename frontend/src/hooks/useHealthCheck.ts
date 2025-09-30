import { useEffect, useState } from 'react'
import healthCheck from '../api/healthCheck'

const useHealthCheck = () => {
  const [isHealthy, setIsHealthy] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isBackendHealthy = async () => {
      const healthy = await healthCheck()
      setIsHealthy(healthy)
    }
    setIsLoading(false)

    isBackendHealthy()
  }, [])

  return {
    isHealthy,
    isLoading,
  }
}

export default useHealthCheck
