import { useEffect } from 'react'
import { UPDATES } from '../pages/ReleaseNotes/changelog'
import { activeModalSignal } from '../signals'
import { MODAL_ID } from '../sharedComponents/Modal/Modal.consts'
import {
  getLocalStorage,
  LOCAL_STORAGE_KEYS,
  setLocalStorage,
} from '../utils/localStorage'

const useWhatsNew = () => {

  useEffect(() => {

    const hasVisitedBefore = getLocalStorage<boolean>(
      LOCAL_STORAGE_KEYS.HAS_VISITED_BEFORE,
      false
    )

    // If this is the user's first visit, mark them as visited and don't show the modal
    if (!hasVisitedBefore) {
      setLocalStorage(LOCAL_STORAGE_KEYS.HAS_VISITED_BEFORE, true)
      return
    }

    // User has visited before, check if there are new release notes
    const lastSeenReleaseDate = getLocalStorage<string | null>(
      LOCAL_STORAGE_KEYS.LAST_SEEN_RELEASE_DATE,
      null
    )

    const latestUpdate = UPDATES[0]
    if (!latestUpdate) return

    // If user hasn't seen any release notes yet, or if there's a newer release
    if (!lastSeenReleaseDate || latestUpdate.date > lastSeenReleaseDate) {
      activeModalSignal.value = {
        id: MODAL_ID.WHATS_NEW_MODAL,
        latestUpdate,
        onDismiss: () => {
          setLocalStorage(LOCAL_STORAGE_KEYS.LAST_SEEN_RELEASE_DATE, latestUpdate.date)
        },
      }
    }
  }, [])
}

export default useWhatsNew
