import { createExperience } from '../actions'

export default function NewExperiencePage() {
  return (
    <div>
      <p className="font-mono text-xs text-periwinkle uppercase tracking-widest mb-8">New Experience</p>
      <form action={createExperience} className="flex flex-col gap-4 max-w-lg">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Title</span>
          <input name="title" required className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Company</span>
          <input name="company" required className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Location</span>
          <input name="location" required className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ink-dim">Period</span>
          <input name="period" required placeholder="Jun 2023 – Present" className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
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
          <span className="font-mono text-xs text-ink-dim">Bullets (one per line)</span>
          <textarea name="bullets" rows={5} className="bg-bg-elevated border border-grid-line rounded-lg px-4 py-2 font-mono text-sm text-ink focus:outline-none focus:border-periwinkle" />
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
