'use client'

import { createContext, useContext, useState } from 'react'

const pathContext = createContext<ReturnType<typeof usePath> | null>(null)

const usePath = () => {
  const [path, setPath] = useState<string[]>(['root'])

  return {
    path,
    append: (folderId: string) => {
      setPath((prev) => [...prev, folderId])
    },
  }
}

export const PathProvider = ({ children }: { children: React.ReactNode }) => {
  const path = usePath()
  return <pathContext.Provider value={path}>{children}</pathContext.Provider>
}

export default function PathConsumer() {
  return useContext(pathContext)
}
