import { useEffect } from 'react'
import { loadUserIntoState } from '../utils'

const useLoadUserIntoState = () => {
  useEffect(() => {
    loadUserIntoState()
  }, [])
}

export default useLoadUserIntoState
