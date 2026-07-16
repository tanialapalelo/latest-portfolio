export type MediumPost = {
  title: string
  link: string
  pubDate: string
  tags: string[]
}

export async function fetchMediumPosts(): Promise<MediumPost[]> {
  try {
    const res = await fetch('https://medium.com/feed/@tanialapalelo', {
      next: { revalidate: 3600 },
    } as RequestInit)
    if (!res.ok) return []
    const xml = await res.text()
    return parseMediumRSS(xml)
  } catch {
    return []
  }
}

function parseMediumRSS(xml: string): MediumPost[] {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
  return items.slice(0, 6).map(([, item]) => ({
    title: extractCDATA(item, 'title') || extractTag(item, 'title'),
    link: extractTag(item, 'link'),
    pubDate: fmtDate(extractTag(item, 'pubDate')),
    tags: [...item.matchAll(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g)]
      .map(m => m[1])
      .slice(0, 3),
  }))
}

function extractCDATA(xml: string, tag: string): string {
  return (
    xml
      .match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
      ?.[1]
      ?.trim() ?? ''
  )
}

function extractTag(xml: string, tag: string): string {
  return xml.match(new RegExp(`<${tag}>([^<]*)<\\/${tag}>`))?.[1]?.trim() ?? ''
}

function fmtDate(raw: string): string {
  if (!raw) return ''
  const d = new Date(raw)
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}
