'use client'

import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { postPhoto } from '../../api/postPhoto'
import syncParams from '../../syncParams'
import { Palette } from '../../types'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.INITIAL)
  const [palette, setPalette] = useState<Palette>([])
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [imageData, setImageData] = useState<string | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(
    null
  )

  const uploadMutation = useMutation({
    mutationFn: postPhoto,
    onSuccess: () => {
      setUploadStatus(UploadStatus.UPLOADED)
    },
    onError: () => {
      setUploadStatus(UploadStatus.ERROR)
    },
  })

  const drawPaletteCircles = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      palette.forEach(swatch => {
        const x = (swatch.percent_location[0] / 100) * ctx.canvas.width
        const y = (swatch.percent_location[1] / 100) * ctx.canvas.height

        ctx.beginPath()
        ctx.arc(x, y, 50, 0, Math.PI * 2)
        ctx.fillStyle = swatch.color
        ctx.fill()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        ctx.stroke()
      })
    },
    [palette]
  )

  const drawCircles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageData) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Only redraw the entire canvas if we don't have a cached image
    if (!ctx.getImageData(0, 0, canvas.width, canvas.height).data.some(x => x !== 0)) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const image = new Image()
      image.src = imageData
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        drawPaletteCircles(ctx)
      }
    } else {
      // Clear and redraw the image first
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const image = new Image()
      image.src = imageData
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        drawPaletteCircles(ctx)
      }
    }
  }, [, imageData, drawPaletteCircles])

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY

      // Check if click is near any circle
      const index = palette.findIndex(swatch => {
        const circleX = (swatch.percent_location[0] / 100) * canvas.width
        const circleY = (swatch.percent_location[1] / 100) * canvas.height
        const distance = Math.sqrt(Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2))
        return distance < 20
      })

      if (index !== -1) {
        setDraggingIndex(index)
      }
    },
    [palette]
  )

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (draggingIndex === null) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (((e.clientX - rect.left) * scaleX) / canvas.width) * 100
      const y = (((e.clientY - rect.top) * scaleY) / canvas.height) * 100

      const newPalette = [...palette]
      newPalette[draggingIndex] = {
        ...newPalette[draggingIndex],
        percent_location: [x, y],
      }
      setPalette(newPalette)
      drawCircles()
    },
    [draggingIndex, palette, drawCircles]
  )

  const handleCanvasMouseUp = useCallback(() => {
    setDraggingIndex(null)
  }, [])

  useEffect(() => {
    drawCircles()
  }, [drawCircles])

  const setPhotoOnCanvas = useCallback((photo: File) => {
    const image = new Image()
    image.src = URL.createObjectURL(photo)
    image.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = image.width
      canvas.height = image.height
      setImageDimensions({ width: image.width, height: image.height })

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(image, 0, 0, image.width, image.height)
      setImageData(canvas.toDataURL())

      URL.revokeObjectURL(image.src)
    }
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const photo = acceptedFiles[0]
      setPhotoOnCanvas(photo)
      setUploadStatus(UploadStatus.UPLOADING)
      const response = await uploadMutation.mutateAsync(photo)
      setPalette(response.palette)
    },
    [setPhotoOnCanvas, uploadMutation]
  )

  return (
    <div>
      <h1>Create</h1>
      <Dropzone onDrop={onDrop} />
      <div
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          aspectRatio: imageDimensions
            ? `${imageDimensions.width} / ${imageDimensions.height}`
            : '1',
        }}
      >
        <canvas
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
      </div>
      {uploadStatus === UploadStatus.UPLOADING && <p>Uploading...</p>}
      {uploadStatus === UploadStatus.ERROR && <p>Error uploading photo</p>}
      {uploadStatus === UploadStatus.UPLOADED && <p>Photo uploaded successfully!</p>}
      {palette.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
          {palette.map(swatch => (
            <div
              key={swatch.color}
              style={{
                width: '200px',
                height: '50px',
                backgroundColor: swatch.color,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'white' }}>{swatch.color}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Create
