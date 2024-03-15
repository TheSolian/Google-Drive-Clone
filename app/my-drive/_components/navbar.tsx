'use client'

import { UserButton } from '@/components/auth/user-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type MyDriveNavbarProps = {}

export const Navbar: React.FC<MyDriveNavbarProps> = ({}) => {
  const pathname = usePathname()

  return (
    <div className="bg-secondary flex justify-between items-center p-4 rounded-xl w-full shadow-sm">
      <div className="flex gap-x-2">
        {/* <Button
          variant={pathname === '/settings' ? 'default' : 'outline'}
          asChild
        >
          <Link href="/settings">Settings</Link>
        </Button> */}
      </div>
      <UserButton />
    </div>
  )
}
