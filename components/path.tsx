import { getPath, getPathFolders } from '@/actions/file'
import usePath from '@/context/path-context'
import { cn } from '@/lib/utils'
import { File } from '@prisma/client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './ui/breadcrumb'

export function Path() {
  const params = useParams<{ folder: string }>()
  const [folders, setFolders] = useState<File[]>()

  useEffect(() => {
    const run = async () => {
      const res = await getPath(params.folder)

      setFolders([...res.success.path].reverse())
    }

    run()
  }, [])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/my-drive/root">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {folders &&
          folders.map((folder) => (
            <BreadcrumbItem key={folder.id}>
              <BreadcrumbLink
                href={`/my-drive/${folder.id}`}
                className={cn({
                  'text-black': folder.id === params.folder,
                })}
              >
                {folder.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
