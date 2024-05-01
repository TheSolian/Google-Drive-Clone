import { createFolder, renameFolder } from '@/actions/file'
import { useCurrentUser } from '@/hooks/use-current-user'
import { cn } from '@/lib/utils'
import { File } from '@prisma/client'
import { SquarePenIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'

type Props = {
  onUpdate: Dispatch<SetStateAction<File[]>>
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  file: File
}

export const UpdateFolderDialog: React.FC<Props> = ({
  onUpdate: setFiles,
  isOpen,
  setIsOpen,
  file,
}) => {
  const [title, setTitle] = useState(file.name)
  const router = useRouter()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (file.awsUrl === null) {
      const res = await renameFolder(file.id, e.currentTarget.folder.value)

      if (res.success) {
        router.refresh()
        setIsOpen(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            id="folder"
            name="folder"
            placeholder="Title"
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <Button className="self-end">Rename</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
