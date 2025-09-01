import { signal } from '@preact/signals-react'
import { type ActiveModal } from '../sharedComponents/Modal/Modal.types'

export const activeModalSignal = signal<ActiveModal | null>(null)
