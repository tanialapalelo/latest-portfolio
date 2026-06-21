'use client'
import { useEffect, useState } from 'react'

type Props = { message: string; description?: string; onDismiss: () => void }

export function AchievementToast({ message, description, onDismiss }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger the enter transition on mount; this synchronizes with the
    // component's lifecycle (a new toast instance via `key`) and can't be derived at render time.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300) }, 3200)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] rounded-[14px] border border-mint bg-bg-elevated p-4 shadow-lg transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
      }`}
      role="status"
      aria-live="polite"
    >
      <p className="font-mono text-xs text-mint uppercase tracking-widest">{message}</p>
      {description && <p className="font-mono text-xs text-ink-dim mt-1">{description}</p>}
    </div>
  )
}
