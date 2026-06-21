'use client'
import { useEffect, useState } from 'react'
import { CommandPalette } from '@/components/ui/CommandPalette'

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(v => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {children}
      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
