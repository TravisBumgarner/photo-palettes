import { useDropzone } from 'react-dropzone'

import { Box } from '@mui/material'
import useGlobalStore from '../../../store'
import { sharedCSS } from './shared'

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
      addAlert(fileRejections.map(rejection => rejection.errors[0].message).join(', '), 'error')
    },
  })

  return (
    <Box
      sx={{
        ...sharedCSS,
        border: `1px dashed`,
        borderColor: 'divider',
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
    </Box>
  )
}

export default Dropzone
