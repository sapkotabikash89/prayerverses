const fs = require('fs');
let content = fs.readFileSync('app/books-of-the-bible/page.tsx', 'utf8');

// Add import for linkifyBibleVerses if not present
if (!content.includes('linkifyBibleVerses')) {
    content = content.replace(
        'import { TableOfContents, type Heading } from "@/components/table-of-contents"',
        'import { TableOfContents, type Heading } from "@/components/table-of-contents"\nimport { linkifyBibleVerses } from "@/lib/bible-links"'
    );
}

// Transform <p className="text-muted-foreground leading-relaxed"> inside the book section
// Only within <section> blocks that have <h3> headings (book sections)
// The pattern is always inside the not-prose div
const regex = /<p className="text-muted-foreground leading-relaxed">\n\s+([\s\S]*?)\n\s+<\/p>/g;

let count = 0;
content = content.replace(regex, (match, innerText) => {
    const trimmed = innerText.trim();
    // Skip if already has dangerouslySetInnerHTML
    if (trimmed.includes('dangerouslySetInnerHTML')) return match;
    // Only transform if it contains verse references (Book + number pattern)
    if (!/\d+:\d+/.test(trimmed) && !/\d+\u2013\d+/.test(trimmed)) return match;

    // Escape backticks for template literal
    const escaped = trimmed.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    count++;
    return `<p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(\`${escaped}\`) }} />`;
});

fs.writeFileSync('app/books-of-the-bible/page.tsx', content);
console.log('Done! Transformed ' + count + ' paragraphs.');
