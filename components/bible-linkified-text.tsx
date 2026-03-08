import Link from "next/link"
import { parseBibleReferences } from "@/lib/bible-parser"

interface BibleLinkifiedTextProps {
    text: string
    className?: string
}

export function BibleLinkifiedText({ text, className }: BibleLinkifiedTextProps) {
    const parts = parseBibleReferences(text)

    return (
        <span className={className}>
            {parts.map((part, index) => {
                if (part.type === "reference" && part.href) {
                    return (
                        <Link
                            key={index}
                            href={part.href}
                            className="font-medium hover:underline bible-verse-link"
                        >
                            {part.content}
                        </Link>
                    )
                }
                return <span key={index}>{part.content}</span>
            })}
        </span>
    )
}
