'use client'

import Link from 'next/link'

interface PostNav {
    title: string
    slug: string
}

interface PostNavigationProps {
    previous?: PostNav
    next?: PostNav
}

export function PostNavigation({ previous, next }: PostNavigationProps) {
    if (!previous && !next) return null

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-8 py-10 border-t border-border mt-12">
            <div className="flex-1 flex flex-col items-start text-left">
                {previous && (
                    <>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                            ← Previous Post
                        </span>
                        <Link
                            href={`/${previous.slug}/`}
                            className="text-lg font-serif font-bold text-primary hover:text-primary/80 transition-colors"
                        >
                            {previous.title}
                        </Link>
                    </>
                )}
            </div>
            <div className="flex-1 flex flex-col items-end text-right">
                {next && (
                    <>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                            Next Post →
                        </span>
                        <Link
                            href={`/${next.slug}/`}
                            className="text-lg font-serif font-bold text-primary hover:text-primary/80 transition-colors"
                        >
                            {next.title}
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}
