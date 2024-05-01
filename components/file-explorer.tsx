'use client'

import { getFiles, getSignedUrl, saveFileToDatabase } from '@/actions/file'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCurrentUser } from '@/hooks/use-current-user'
import { computeSHA256 } from '@/lib/utils'
import { File as DbFile } from '@prisma/client'
import { useParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CreateFolderDialog } from './create-folder-dialog'
import { FileExplorerItem } from './file-explorer-item'
import { Path } from './path'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Separator } from './ui/separator'

export function FileExplorer() {
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null)
  const [files, setFiles] = useState<DbFile[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams<{ folder: string }>()
  const user = useCurrentUser()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (filesToUpload) {
      if (filesToUpload.length > 1) {
        return toast.error('Input is limitted to 1 file')
      }

      const file = filesToUpload[0]

      const res = await getSignedUrl(
        file.name,
        file.type,
        file.size,
        await computeSHA256(file)
      )

      if (res.success) {
        const { url, key } = res.success

        setIsLoading(true)

        const uploadRes = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        })

        if (uploadRes.status == 200) {
          const newFile = await saveFileToDatabase(
            file.name,
            file.type,
            file.size,
            params.folder === 'root' ? null : params.folder,
            user?.id!,
            key
          )

          setFiles((prev) => [...prev, newFile])
        }

        setIsUploadDialogOpen(false)
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    const run = async () => {
      setIsLoading(true)
      const files = await getFiles(
        params.folder === 'root' ? null : params.folder,
        user?.id!
      )
      setIsLoading(false)
      setFiles(files)
    }
    run()

    window.getSelection()?.removeAllRanges()
  }, [])

  return (
    <main className="w-full h-full bg-white rounded-lg">
      <div className="flex p-4 items-center justify-between">
        <Path />
        <div className="flex items-center gap-2">
          <CreateFolderDialog onAdd={setFiles} />
          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="space-x-2">Upload</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit} className="flex p-4">
                <Input
                  type="file"
                  name="file"
                  id="file"
                  className="border-none rounded-none shadow-none"
                  onChange={(e) => {
                    if (e.currentTarget.files) {
                      setFilesToUpload(e.currentTarget.files)
                    }
                  }}
                />
                <Button disabled={isLoading}>
                  {isLoading ? 'Uploading...' : 'Upload'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col divide-y">
        {files
          .sort((a, b) => {
            if (a.fileType === null && b.fileType !== null) return -1
            if (a.fileType !== null && b.fileType === null) return 1

            return a.name.localeCompare(b.name)
          })
          .map((file) => (
            <FileExplorerItem file={file} onChange={setFiles} key={file.id} />
          ))}
        {!isLoading && files.length === 0 && (
          <p className="text-center text-xl mt-12">Folder has no content</p>
        )}
      </div>
    </main>
  )
}
