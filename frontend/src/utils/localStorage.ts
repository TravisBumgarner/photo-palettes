import { logger } from '../services/logging'

// Define keys used in localStorage
export const LOCAL_STORAGE_KEYS = {} as const

type LocalStorageKey =
  (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS]

// Get from localStorage
export const getLocalStorage = <T = string>(
  key: LocalStorageKey,
  fallback: T
): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch (err) {
    logger.error(`Error getting localStorage key "${key}":`, err)
    return fallback
  }
}

// Set to localStorage
export const setLocalStorage = <T = string>(
  key: LocalStorageKey,
  value: T
): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    logger.error(`Error setting localStorage key "${key}":`, err)
  }
}
