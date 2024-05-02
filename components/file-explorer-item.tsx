import { deleteFolder } from '@/actions/file'
import { Button } from '@/components/ui/button'
import usePath from '@/context/path-context'
import { formateBytes } from '@/lib/utils'
import { File } from '@prisma/client'
import {
  DotsHorizontalIcon,
  DownloadIcon,
  TrashIcon,
} from '@radix-ui/react-icons'
import { FileTextIcon, FolderIcon, SquarePenIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dispatch, MouseEvent, SetStateAction, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { UpdateFolderDialog } from './update-folder-dialog'

type Props = {
  file: File
  onChange: Dispatch<SetStateAction<File[]>>
}

export const FileExplorerItem: React.FC<Props> = ({ file, onChange }) => {
  const router = useRouter()
  const path = usePath()
  const isFolder = file.awsUrl === null
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

  async function handleClick(e: MouseEvent<HTMLDivElement>) {
    if (!isFolder) return

    path?.append(file.id)
    router.push(file.id)
  }

  async function handleDelete() {
    if (file.awsUrl === null) {
      const res = await deleteFolder(file.id)

      if (res.success) {
        onChange((prev) => prev.filter((x) => x.id !== file.id))
      }
    }
  }

  return (
    <div
      onDoubleClick={handleClick}
      className="flex justify-between items-center p-2 hover:bg-gray-100 px-8"
    >
      <div className="flex items-center gap-2">
        {file.awsUrl === null ? <FolderIcon /> : <FileTextIcon />}
        <div>{file.name}</div>
      </div>
      <div className="flex items-center gap-2">
        {file.size !== null && (
          <div className="text-sm text-muted-foreground ">{`${formateBytes(
            file.size!
          )}`}</div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsUpdateDialogOpen(true)}
            >
              <SquarePenIcon className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UpdateFolderDialog
          onUpdate={onChange}
          isOpen={isUpdateDialogOpen}
          setIsOpen={setIsUpdateDialogOpen}
          file={file}
        />
      </div>
    </div>
  )
}
