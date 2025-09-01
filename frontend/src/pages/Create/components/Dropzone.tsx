import { useDropzone } from 'react-dropzone'

import Box from '@mui/material/Box'
import useGlobalStore from '../../../store'
import { sharedCSS } from './shared'
import { logger } from '../../../services/logging'
import { Capacitor } from '@capacitor/core'

const Dropzone = ({ onDrop }: { onDrop: (acceptedFiles: File[]) => void }) => {
  const addAlert = useGlobalStore((state) => state.addAlert)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    // maxSize: 1024 * 1024 * 5, // The image is converted on a canvas to another type. Separately, we already check on the backend for large files.
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    onDropRejected: (fileRejections) => {
      // There are multiple errors thrown if too many files are uploaded.
      // It looks goofy so we'll just display the first error and let the user try again.
      logger.info(
        'User performed a weird action trying to drop a file: ' +
          JSON.stringify(fileRejections)
      )
      addAlert(fileRejections[0].errors[0].message, 'error')
    },
  })

  return (
    <Box
      sx={{
        ...sharedCSS,
        border: `2px dashed`,
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
        <p>
          {Capacitor.isNativePlatform()
            ? 'Tap to select photo'
            : 'Drag and drop photo or click to select photo'}
        </p>
      )}
    </Box>
  )
}

export default Dropzone
