import { Hero } from '@/components/home/Hero'
import { AboutSection } from '@/components/home/AboutSection'
import { ProjectsSection } from '@/components/home/ProjectsSection'
import { WritingSection } from '@/components/home/WritingSection'
import { CommunitySection } from '@/components/home/CommunitySection'

export default function Home() {
  return (
    <div className="relative z-10 mx-auto max-w-[1080px] px-6">
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <WritingSection />
      <CommunitySection />
    </div>
  )
}
