import { useDropzone } from 'react-dropzone'

import syncParams from '../../../syncParams'
import { HEIGHT, WIDTH } from '../consts'

const Dropzone = ({ onDrop }: { onDrop: (acceptedFiles: File[]) => void }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 5,
    accept: {
      'image/*': [...syncParams.supportedImageTypes],
    },
    onDropRejected: fileRejections => {
      alert(fileRejections)
    },
  })

  return (
    <div
      style={{
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        border: '1px dashed black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      )}
    </div>
  )
}

export default Dropzone
