'use client'

import { useMutation } from '@tanstack/react-query'
import { useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { postPhoto } from '../../api/postPhoto'
import syncParams from '../sync_params.json'

enum UploadStatus {
  INITIAL = 'INITIAL',
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  ERROR = 'ERROR',
}

const Dropzone = ({ onDrop }: { onDrop: (acceptedFiles: File[]) => void }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 5,
    accept: syncParams.supported_image_types.frontend,
    onDropRejected: fileRejections => {
      alert(fileRejections)
    },
  })

  return (
    <div
      style={{
        width: '400px',
        height: '100px',
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

const Create = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.INITIAL)

  const uploadMutation = useMutation({
    mutationFn: postPhoto,
    onSuccess: () => {
      setUploadStatus(UploadStatus.UPLOADED)
    },
    onError: () => {
      setUploadStatus(UploadStatus.ERROR)
    },
  })

  const setPhotoOnCanvas = useCallback((photo: File) => {
    const image = new Image()
    image.src = URL.createObjectURL(photo)
    image.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = image.width
      canvas.height = image.height

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(image, 0, 0, image.width, image.height)

      URL.revokeObjectURL(image.src)
    }
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const photo = acceptedFiles[0]
      setPhotoOnCanvas(photo)
      setUploadStatus(UploadStatus.UPLOADING)
      uploadMutation.mutate(photo)
    },
    [setPhotoOnCanvas, uploadMutation]
  )

  return (
    <div>
      <h1>Create</h1>
      <Dropzone onDrop={onDrop} />
      <canvas style={{ width: '400px', height: '400px' }} ref={canvasRef} />
      {uploadStatus === UploadStatus.UPLOADING && <p>Uploading...</p>}
      {uploadStatus === UploadStatus.ERROR && <p>Error uploading photo</p>}
      {uploadStatus === UploadStatus.UPLOADED && <p>Photo uploaded successfully!</p>}
    </div>
  )
}

export default Create
