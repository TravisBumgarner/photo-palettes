'use client'

import { Button } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { generatePalette } from '../../api/generatePalette'
import { savePalette } from '../../api/savePalette'
import syncParams from '../../syncParams'
import { Palette } from '../../types'
import Loading from '../sharedComponents/Loading'

const WIDTH = 800
const HEIGHT = 600

enum UploadStatus {
  INITIAL = 'INITIAL',
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  ERROR = 'ERROR',
}

const DraggableSwatch = ({
  swatch,
  index,
  handleSetDraggingIndex,
}: {
  swatch: Palette[number]
  index: number
  handleSetDraggingIndex: (index: number) => void
}) => {
  const handleMouseDown = useCallback(() => {
    handleSetDraggingIndex(index)
  }, [handleSetDraggingIndex, index])

  return (
    <div
      style={{
        position: 'absolute',
        left: `${swatch.percent_location[0]}%`,
        top: `${swatch.percent_location[1]}%`,
        transform: 'translate(-50%, -50%)',
        width: '15px',
        height: '15px',
        borderRadius: '50%',
        backgroundColor: swatch.color,
        border: '2px solid white',
        cursor: 'pointer',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
      onMouseDown={handleMouseDown}
    />
  )
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

const Create = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [_uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.INITIAL)
  const [palette, setPalette] = useState<Palette>([])
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [imageData, setImageData] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(
    null
  )
  const [paletteId, setPaletteId] = useState<string | null>(null)

  const generatePaletteMutation = useMutation({
    mutationFn: generatePalette,
    onSuccess: () => {
      setUploadStatus(UploadStatus.UPLOADED)
    },
    onError: () => {
      setUploadStatus(UploadStatus.ERROR)
    },
  })

  const savePaletteMutation = useMutation({
    mutationFn: savePalette,
    onSuccess: () => {
      setUploadStatus(UploadStatus.UPLOADED)
    },
    onError: () => {
      setUploadStatus(UploadStatus.ERROR)
    },
  })

  const drawCircles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageData) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Only draw the image once
    if (!ctx.getImageData(0, 0, canvas.width, canvas.height).data.some(x => x !== 0)) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const image = new Image()
      image.src = imageData
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      }
    }
  }, [imageData])

  const sampleColorAtPosition = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const pixelX = x * scaleX
    const pixelY = y * scaleY
    const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data
    return `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`
  }, [])

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggingIndex === null) return

      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      const newColor = sampleColorAtPosition(e.clientX - rect.left, e.clientY - rect.top)
      if (!newColor) return

      const newPalette = [...palette]
      newPalette[draggingIndex] = {
        color: newColor,
        percent_location: [x, y],
      }
      setPalette(newPalette)
    },
    [draggingIndex, palette, sampleColorAtPosition]
  )

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      // Check if click is near any circle
      const index = palette.findIndex(swatch => {
        const circleX = swatch.percent_location[0]
        const circleY = swatch.percent_location[1]
        const distance = Math.sqrt(Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2))
        return distance < 5 // 5% threshold for clicking
      })

      if (index !== -1) {
        setDraggingIndex(index)
      }
    },
    [palette]
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

  const handleSetDraggingIndex = useCallback((index: number) => {
    setDraggingIndex(index)
  }, [])

  const handleSavePalette = useCallback(() => {
    if (!paletteId) return
    savePaletteMutation.mutate({
      palette,
      paletteId,
      name: 'My Palette',
    })
  }, [palette, paletteId, savePaletteMutation])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsLoading(true)
      const photo = acceptedFiles[0]
      setPhotoOnCanvas(photo)
      setUploadStatus(UploadStatus.UPLOADING)
      const response = await generatePaletteMutation.mutateAsync(photo)
      setPalette(response.palette)
      setPaletteId(response.palette_id)
      setIsLoading(false)
    },
    [setPhotoOnCanvas, generatePaletteMutation]
  )

  const clearData = useCallback(() => {
    setImageData(null)
    setPalette([])
    setUploadStatus(UploadStatus.INITIAL)
    setIsLoading(false)
    canvasRef.current
      ?.getContext('2d')
      ?.clearRect(0, 0, canvasRef.current?.width, canvasRef.current?.height)
  }, [])

  return (
    <div>
      <h1>Create</h1>
      {imageData && <button onClick={clearData}>Clear Data</button>}
      {!isLoading && !imageData && <Dropzone onDrop={onDrop} />}
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}
        >
          <Loading />
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: `${WIDTH}px`,
          maxHeight: `${HEIGHT}px`,
          margin: '0 auto',
          position: 'relative',
          aspectRatio: imageDimensions
            ? `${imageDimensions.width} / ${imageDimensions.height}`
            : '1',
        }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        <canvas
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
          ref={canvasRef}
        />
        {palette.map((swatch, index) => (
          <DraggableSwatch
            key={swatch.color}
            swatch={swatch}
            index={index}
            handleSetDraggingIndex={handleSetDraggingIndex}
          />
        ))}
      </div>
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
          <Button variant="contained" onClick={handleSavePalette}>
            Save Palette
          </Button>
        </div>
      )}
    </div>
  )
}

export default Create
