'use client'

import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

interface BackButtonProps {
  href: string
  label: string
}

export const BackButton: React.FC<BackButtonProps> = ({ href, label }) => {
  return (
    <Button variant={'link'} className="font-normal w-full" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  )
}
