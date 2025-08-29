import { type FC } from 'react'
import useGlobalStore from '../../store'
import ConfirmationModal from './components/ConfirmationModal'

const RenderModal: FC = () => {
  const { activeModal } = useGlobalStore()

  if (!activeModal) return null

  switch (activeModal.id) {
    case 'ConfirmationModal':
      return <ConfirmationModal {...activeModal} />
  }
}

export default RenderModal
