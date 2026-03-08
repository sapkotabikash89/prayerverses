import { parseVerseId } from "./bible-text"

/**
 * Rewrites legacy verse links in content to use anchor-based navigation.
 * 
 * Legacy formats:
 * 1. /bible/[book]/[chapter]/[verse]/ -> /bible/[book]/[chapter]/#verse[verse]
 * 2. /verse/[verse-id]/ -> /bible/[book]/[chapter]/#verse[verse]
 * 
 * [verse-id] is usually book-chapter-verse
 */
export function rewriteVerseLinks(html: string): string {
    if (!html) return ""

    // 1. Rewrite /bible/[book]/[chapter]/[verse]/ links
    // Match format: /bible/(book-slug)/(chapter)/(verse)/
    const bibleRegex = /\/bible\/([a-z0-9-]+)\/(\d+)\/(\d+)\/?/g
    let updatedHtml = html.replace(bibleRegex, '/bible/$1/$2/#verse$3')

    // 2. Rewrite /verse/[verse-id]/ links
    // Match format: /verse/(all-characters-until-slash)/
    const verseRegex = /\/verse\/([a-z0-9-]+)\/?/g
    updatedHtml = updatedHtml.replace(verseRegex, (match, verseId) => {
        const parsed = parseVerseId(verseId)
        if (parsed) {
            return `/bible/${parsed.bookSlug}/${parsed.chapter}/#verse${parsed.verse}`
        }
        return match // Fallback to original if parsing fails
    })

    // 3. Rewrite blog.prayerverses.com links to prayerverses.com, excluding wp-content/wp-includes
    updatedHtml = updatedHtml.replace(/https?:\/\/blog\.prayerverses\.com\/(?!wp-content|wp-includes)/g, 'https://prayerverses.com/')

    return updatedHtml
}
