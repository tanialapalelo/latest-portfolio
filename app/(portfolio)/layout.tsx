import { GameModeProvider } from '@/lib/game-mode-context'
import { FallingChars } from '@/components/ui/FallingChars'
import { XPBar } from '@/components/ui/XPBar'
import { GameModeOverlay } from '@/components/ui/GameModeOverlay'
import { GameModePill } from '@/components/ui/GameModePill'
import { KonamiCode } from '@/components/ui/KonamiCode'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { CommandPaletteProvider } from '@/components/layout/CommandPaletteProvider'

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameModeProvider>
      <CommandPaletteProvider>
        <FallingChars />
        <XPBar />
        <Nav />
        <GameModePill />
        <GameModeOverlay />
        <KonamiCode />
        <main className="pt-16">{children}</main>
        <Footer />
      </CommandPaletteProvider>
    </GameModeProvider>
  )
}
