import { useEffect, useState } from 'react'
import healthCheck from '../api/healthCheck'

const useHealthCheck = () => {
  // Optimistically assume healthy until we know otherwise
  const [isHealthy, setIsHealthy] = useState(true)
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
