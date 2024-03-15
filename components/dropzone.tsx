'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface DropzoneProps {}

export const Dropzone: React.FC<DropzoneProps> = ({}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className="bg-red-300 w-[30rem] h-52">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  )
}
