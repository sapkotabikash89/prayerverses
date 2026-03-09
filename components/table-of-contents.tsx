export interface Heading {
    id: string
    text: string
}

interface TableOfContentsProps {
    headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    if (headings.length === 0) return null

    return (
        <div className="my-10 p-6 rounded-none border border-border bg-secondary/30">
            <h2 className="text-lg font-serif font-bold text-card-foreground mb-4">Table of Contents</h2>
            <nav aria-label="Table of Contents">
                <ol className="space-y-3 list-decimal list-inside">
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
                </ol>
            </nav>
        </div>
    )
}
