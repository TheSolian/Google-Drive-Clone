'use client'

import { logout } from '@/actions/logout'
import { Button } from '@/components/ui/button'
import React from 'react'

type LogoutButtonProps = {
  children?: React.ReactNode
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ children }) => {
  const onClick = () => {
    logout()
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}
