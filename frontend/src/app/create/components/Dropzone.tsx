import { useDropzone } from 'react-dropzone'

import useGlobalStore from '../../../store'
import { PALETTE } from '../../../styles/Theme'
import { HEIGHT, WIDTH } from '../consts'

const Dropzone = ({ onDrop }: { onDrop: (acceptedFiles: File[]) => void }) => {
  const addAlert = useGlobalStore(state => state.addAlert)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 5,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    onDropRejected: fileRejections => {
      addAlert(fileRejections.map(rejection => rejection.errors[0].message).join(', '))
    },
  })

  return (
    <div
      style={{
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        border: `1px dashed ${PALETTE.primary[500]}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop photo here ...</p>
      ) : (
        <p>Drag and drop photo or click to select photo</p>
      )}
    </div>
  )
}

export default Dropzone
