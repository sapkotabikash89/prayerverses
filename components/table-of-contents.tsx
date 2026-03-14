export interface Heading {
    id: string
    text: string
}

interface TableOfContentsProps {
    headings: Heading[]
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  return (
    <div className="my-8 rounded-2xl border-0 bg-secondary/50 p-6 md:p-8 not-prose shadow-sm">
      <h4 className="text-xl font-bold font-serif mb-4 mt-0 text-card-foreground">Table of Contents</h4>
      <ul className="space-y-3 list-none pl-0 mb-0">
        {headings.map((heading) => (
          <li key={heading.id} className="text-base border-b border-border/40 pb-3 last:border-0 last:pb-0">
            <a
              href={`#${heading.id}`}
              className="text-muted-foreground hover:text-primary transition-colors font-medium decoration-primary/30 underline-offset-4 hover:underline block"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
