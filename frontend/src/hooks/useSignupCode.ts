import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { LOCAL_STORAGE_KEYS, setLocalStorage } from '../utils/localStorage'
import { SUPER_SECRET_INVITATION_KEY } from '../consts'

const useSignupCode = () => {
  const searchParams = useSearchParams()
  const signupCode = searchParams.get('signup_code')

  useEffect(() => {
    // Avoid those pesky XSS attacks!
    if (signupCode === SUPER_SECRET_INVITATION_KEY) {
      setLocalStorage(LOCAL_STORAGE_KEYS.SIGNUP_CODE, signupCode)
    }
  }, [signupCode])
}

export default useSignupCode
