import { bibleBooks } from "@/data/bible"

export interface BiblePart {
    type: "text" | "reference"
    content: string
    href?: string
}

/**
 * Parses text and identifies Bible references, returning an array of parts.
 */
export function parseBibleReferences(text: string): BiblePart[] {
    if (!text) return []

    // Create a list of book names (and common variations like Psalm)
    const bookNames = bibleBooks.map(b => b.name)
    if (!bookNames.includes("Psalm")) bookNames.push("Psalm")

    // Sort by length descending to match "1 John" before "John"
    const sortedBooks = bookNames.sort((a, b) => b.length - a.length)
    const booksRegexPart = sortedBooks.map(b => b.replace(/\s+/g, '\\s+')).join('|')

    // Combined regex that matches all three patterns:
    // Group 1: Book name
    // Group 2: First number (chapter or chapter in chapter:verse)
    // Group 3: Optional colon + verse (e.g., ":16")
    // Group 4: The verse number itself (from group 3)
    // Group 5: Optional range part (e.g., "–31", "-5", "–7:3")
    const refRegex = new RegExp(
        `\\b(${booksRegexPart})\\s+(\\d+)(:(\\d+))?(?:[–\\-](\\d+(?::\\d+)?))?\\b`,
        'gi'
    )

    const parts: BiblePart[] = []
    let lastIndex = 0
    let match

    while ((match = refRegex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            parts.push({
                type: "text",
                content: text.slice(lastIndex, match.index)
            })
        }

        const [fullMatch, book, firstNum, _colonVerse, verse, rangeEnd] = match
        let normalizedBook = book.trim()
        if (normalizedBook.toLowerCase() === "psalm") normalizedBook = "Psalms"

        const bookMeta = bibleBooks.find(b => b.name.toLowerCase() === normalizedBook.toLowerCase())

        if (bookMeta) {
            const chapter = firstNum
            let href = ""

            if (verse) {
                // Link to chapter page with anchor for the specific verse
                href = `/bible/${bookMeta.slug}/${chapter}/#verse${verse}`
            } else if (rangeEnd) {
                // Chapter range without verse (e.g., "Leviticus 1–7") → link to first chapter
                href = `/bible/${bookMeta.slug}/${chapter}/`
            }

            if (href) {
                parts.push({
                    type: "reference",
                    content: fullMatch,
                    href
                })
            } else {
                // Just a chapter number with no verse and no range — treat as text
                parts.push({
                    type: "text",
                    content: fullMatch
                })
            }
        } else {
            // Should not happen with current regex, but safety fallback
            parts.push({
                type: "text",
                content: fullMatch
            })
        }

        lastIndex = refRegex.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push({
            type: "text",
            content: text.slice(lastIndex)
        })
    }

    return parts
}
