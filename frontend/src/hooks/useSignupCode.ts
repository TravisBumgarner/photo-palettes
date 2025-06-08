import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { LOCAL_STORAGE_KEYS, setLocalStorage } from '../utils/localStorage'

const useSignupCode = () => {
  const searchParams = useSearchParams()

  useEffect(() => {
    const signupCode = searchParams.get('signup_code')
    if (signupCode) {
      setLocalStorage(LOCAL_STORAGE_KEYS.SIGNUP_CODE, signupCode)
    }
  }, [searchParams])
}

export default useSignupCode
