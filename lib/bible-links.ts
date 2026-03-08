import { bibleBooks } from "@/data/bible"

/**
 * Automatically find Bible references in HTML and wrap them in clickable links.
 * 
 * Handles three patterns:
 * 1. Single verse:    "John 3:16"        → /verse/john-3-16/
 * 2. Verse range:     "Genesis 1:1–31"   → /bible/genesis/1/  (chapter link)
 * 3. Chapter range:   "Leviticus 1–7"    → /bible/leviticus/1/ (first chapter)
 * 
 * Supports both en-dash (–) and hyphen (-) as range separators.
 */
export function linkifyBibleVerses(html: string): string {
    if (!html) return ""

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

    return html.replace(refRegex, (match, book, firstNum, _colonVerse, verse, rangeEnd) => {
        let normalizedBook = book.trim()
        if (normalizedBook.toLowerCase() === "psalm") normalizedBook = "Psalms"

        const bookMeta = bibleBooks.find(b => b.name.toLowerCase() === normalizedBook.toLowerCase())
        if (!bookMeta) return match

        const chapter = firstNum

        if (verse) {
            // Link to chapter page with anchor for the specific verse
            return `<a href="/bible/${bookMeta.slug}/${chapter}/#verse${verse}" class="bible-verse-link">${match}</a>`
        } else if (rangeEnd) {
            // Chapter range without verse (e.g., "Leviticus 1–7") → link to first chapter
            return `<a href="/bible/${bookMeta.slug}/${chapter}/" class="bible-verse-link">${match}</a>`
        }

        // Just a chapter number with no verse and no range — don't linkify
        return match
    })
}
