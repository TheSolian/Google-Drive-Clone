'use client'

import { UserButton } from '@/components/auth/user-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type SettingsNavbarProps = {}

export const Navbar: React.FC<SettingsNavbarProps> = ({}) => {
  const pathname = usePathname()

  return (
    <div className="bg-secondary flex justify-between items-center p-4 rounded-xl w-full shadow-sm">
      <div className="flex gap-x-2">
        <div className="flex items-center gap-x-8">
          <Link href="/my-drive" className="text-2xl font-semibold">
            Drive
          </Link>
          <Button
            variant={pathname === '/settings' ? 'default' : 'outline'}
            asChild
          >
            <Link href="/settings">Settings</Link>
          </Button>
        </div>
      </div>
      <UserButton />
    </div>
  )
}
