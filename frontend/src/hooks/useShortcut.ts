// useShortcut.ts
import Mousetrap from 'mousetrap'
import { useEffect } from 'react'

export function useShortcut(keys: string | string[], callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      e.preventDefault()
      callback()
      return false
    }

    // Enable shortcuts to work even when focused on input elements
    const originalStopCallback = Mousetrap.prototype.stopCallback
    Mousetrap.prototype.stopCallback = function (
      e: KeyboardEvent,
      element: Element,
      combo: string
    ) {
      // Allow our specific shortcuts to work in input fields
      const allowedShortcuts = Array.isArray(keys) ? keys : [keys]
      if (allowedShortcuts.includes(combo)) {
        return false
      }
      return originalStopCallback.call(this, e, element, combo)
    }

    Mousetrap.bind(keys, handler)

    return () => {
      Mousetrap.unbind(keys)
      // Restore original stopCallback
      Mousetrap.prototype.stopCallback = originalStopCallback
    }
  }, [keys, callback])
}
