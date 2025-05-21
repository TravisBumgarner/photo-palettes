'use client'

import { type FC } from 'react'
import useGlobalStore from '../../../store'
import { ModalID } from './Modal.consts'
import ConfirmationModal from './components/ConfirmationModal'

const RenderModal: FC = () => {
  const { activeModal } = useGlobalStore()

  if (!activeModal) return null

  switch (activeModal.id) {
    case ModalID.ConfirmationModal:
      return <ConfirmationModal {...activeModal} />
  }
}

export default RenderModal
