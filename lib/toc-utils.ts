import React from 'react'

export interface Heading {
    id: string
    text: string
}

/**
 * Parses content to extract h2 headings and inject IDs into them in a single pass.
 */
export function processContentForTOC(content: string): { updatedContent: string, headings: Heading[] } {
    const headings: Heading[] = []

    const updatedContent = content.replace(/<h2([^>]*)>(.*?)<\/h2>/g, (match, attrs, innerHtml) => {
        const text = innerHtml.replace(/<[^>]*>/g, '').trim()
        if (!text) return match

        const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '')

        headings.push({ id, text })

        // If it already has an ID, don't overwrite it but keep track of it
        if (attrs.includes('id=')) {
            const existingIdMatch = attrs.match(/id=["']([^"']*)["']/)
            if (existingIdMatch) {
                headings[headings.length - 1].id = existingIdMatch[1]
                return match
            }
        }

        return `<h2 id="${id}"${attrs}>${innerHtml}</h2>`
    })

    return { updatedContent, headings }
}
