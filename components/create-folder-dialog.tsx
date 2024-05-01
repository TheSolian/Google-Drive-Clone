import { createFolder } from '@/actions/file'
import { useCurrentUser } from '@/hooks/use-current-user'
import { File } from '@prisma/client'
import { useParams } from 'next/navigation'
import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'

type Props = {
  onAdd: Dispatch<SetStateAction<File[]>>
}

export const CreateFolderDialog: React.FC<Props> = ({ onAdd: setFiles }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const params = useParams<{ folder: string }>()
  const user = useCurrentUser()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    console.log(params.folder === 'root' ? null : params.folder)

    const res = await createFolder(
      e.currentTarget.folder.value,
      params.folder === 'root' ? null : params.folder,
      user?.id!
    )

    if (res.success) {
      setFiles((prev) => [...prev, res.success?.newFolder])
      setIsDialogOpen(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Create Folder</Button>
      </DialogTrigger>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            id="folder"
            name="folder"
            placeholder="Title"
            autoComplete="off"
          />
          <Button className="self-end">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
