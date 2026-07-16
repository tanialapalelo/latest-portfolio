import { createProject } from '../actions'

export default function NewProjectPage() {
  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">New Project</p>
      <form action={createProject} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Slug (matches MDX filename)</span>
          <input name="slug" required placeholder="calendar-clone" className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Case Study Number</span>
          <input name="case_study_number" required placeholder="03" className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Tagline</span>
          <input name="tagline" required className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Accent</span>
          <select name="accent" className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle">
            <option value="periwinkle">periwinkle</option>
            <option value="mint">mint</option>
            <option value="coral">coral</option>
            <option value="marigold">marigold</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Tech (comma-separated)</span>
          <input name="tech" required placeholder="Next.js 16, TypeScript, PostgreSQL" className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Sort order</span>
          <input name="sort_order" type="number" defaultValue={0} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <button type="submit" className="bg-periwinkle text-bg font-mono text-sm px-5 py-2.5 rounded-lg self-start">
          Save
        </button>
      </form>
    </div>
  )
}
