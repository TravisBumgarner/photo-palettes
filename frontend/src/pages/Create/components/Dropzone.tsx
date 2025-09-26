import { Capacitor } from '@capacitor/core'
import Box from '@mui/material/Box'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { logger } from '../../../services/logging'
import Message from '../../../sharedComponents/Message'
import { SPACING } from '../../../styles/styleConsts'
import { sharedCSS } from './shared'

const Dropzone = ({ onDrop }: { onDrop: (acceptedFiles: File[]) => void }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    // maxSize: 1024 * 1024 * 5, // The image is converted on a canvas to another type. Separately, we already check on the backend for large files.
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/jpg': [],
      'image/webp': [],
      'image/gif': [],
      'image/bmp': [],
      'image/avif': [],
    },
    onDropRejected: (fileRejections) => {
      // There are multiple errors thrown if too many files are uploaded.
      // It looks goofy so we'll just display the first error and let the user try again.
      logger.info(
        'User performed a weird action trying to drop a file: ' +
          JSON.stringify(fileRejections)
      )
      setErrorMessage(fileRejections[0].errors[0].message)
    },
  })

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: SPACING.MEDIUM.PX }}
    >
      {errorMessage && <Message message={errorMessage} color="error" />}
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
    </Box>
  )
}

export default Dropzone
