'use client'

import { FormError } from '@/components/form-error'
import { useCurrentRole } from '@/hooks/use-current-role'
import { UserRole } from '@prisma/client'
import { DividerHorizontalIcon } from '@radix-ui/react-icons'

type RoleGateProps = {
  children: React.ReactNode
  allowedRole: UserRole
}

export const RoleGate: React.FC<RoleGateProps> = ({
  allowedRole,
  children,
}) => {
  const role = useCurrentRole()

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    )
  }

  return <>{children}</>
}
