export interface Heading {
    id: string
    text: string
}

interface TableOfContentsProps {
    headings: Heading[]
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  return (
    <div className="my-8 rounded-none border border-border bg-secondary/30 p-6">
      <h4>Table of Contents</h4>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className="text-sm">
            <a
              href={`#${heading.id}`}
              className="text-muted-foreground hover:text-primary transition-colors font-medium decoration-primary/30 underline-offset-4 hover:underline"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
