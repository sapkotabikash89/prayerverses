import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Helper to read JSON files without ESM import issues in Node
function readJson(relPath) {
    const fullPath = path.join(rootDir, relPath);
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

// Simple implementation of rewriteVerseLinks (matching the one in lib/link-utils.ts if possible)
function rewriteVerseLinks(content) {
    if (!content) return "";
    return content.replace(/\[([^\]]+)\]\(bible:\/\/([^\)]+)\)/g, (match, text, ref) => {
        return text; // Just return text for search index
    });
}

async function generateIndex() {
    console.log("Generating search index...");
    const bibleBooks = [
        { slug: "genesis", name: "Genesis" }, { slug: "exodus", name: "Exodus" }, { slug: "leviticus", name: "Leviticus" },
        { slug: "numbers", name: "Numbers" }, { slug: "deuteronomy", name: "Deuteronomy" }, { slug: "joshua", name: "Joshua" },
        { slug: "judges", name: "Judges" }, { slug: "ruth", name: "Ruth" }, { slug: "1-samuel", name: "1 Samuel" },
        { slug: "2-samuel", name: "2 Samuel" }, { slug: "1-kings", name: "1 Kings" }, { slug: "2-kings", name: "2 Kings" },
        { slug: "1-chronicles", name: "1 Chronicles" }, { slug: "2-chronicles", name: "2 Chronicles" }, { slug: "ezra", name: "Ezra" },
        { slug: "nehemiah", name: "Nehemiah" }, { slug: "esther", name: "Esther" }, { slug: "job", name: "Job" },
        { slug: "psalm", name: "Psalms" },
        { slug: "proverbs", name: "Proverbs" }, { slug: "ecclesiastes", name: "Ecclesiastes" },
        { slug: "song-of-solomon", name: "Song of Solomon" }, { slug: "isaiah", name: "Isaiah" }, { slug: "jeremiah", name: "Jeremiah" },
        { slug: "lamentations", name: "Lamentations" }, { slug: "ezekiel", name: "Ezekiel" }, { slug: "daniel", name: "Daniel" },
        { slug: "hosea", name: "Hosea" }, { slug: "joel", name: "Joel" }, { slug: "amos", name: "Amos" },
        { slug: "obadiah", name: "Obadiah" }, { slug: "jonah", name: "Jonah" }, { slug: "micah", name: "Micah" },
        { slug: "nahum", name: "Nahum" }, { slug: "habakkuk", name: "Habakkuk" }, { slug: "zephaniah", name: "Zephaniah" },
        { slug: "haggai", name: "Haggai" }, { slug: "zechariah", name: "Zechariah" }, { slug: "malachi", name: "Malachi" },
        { slug: "matthew", name: "Matthew" }, { slug: "mark", name: "Mark" }, { slug: "luke", name: "Luke" },
        { slug: "john", name: "John" }, { slug: "acts", name: "Acts" }, { slug: "romans", name: "Romans" },
        { slug: "1-corinthians", name: "1 Corinthians" }, { slug: "2-corinthians", name: "2 Corinthians" },
        { slug: "galatians", name: "Galatians" }, { slug: "ephesians", name: "Ephesians" }, { slug: "philippians", name: "Philippians" },
        { slug: "colossians", name: "Colossians" }, { slug: "1-thessalonians", name: "1 Thessalonians" },
        { slug: "2-thessalonians", name: "2 Thessalonians" }, { slug: "1-timothy", name: "1 Timothy" },
        { slug: "2-timothy", name: "2 Timothy" }, { slug: "titus", name: "Titus" }, { slug: "philemon", name: "Philemon" },
        { slug: "hebrews", name: "Hebrews" }, { slug: "james", name: "James" }, { slug: "1-peter", name: "1 Peter" },
        { slug: "2-peter", name: "2 Peter" }, { slug: "1-john", name: "1 John" }, { slug: "2-john", name: "2 John" },
        { slug: "3-john", name: "3 John" }, { slug: "jude", name: "Jude" }, { slug: "revelation", name: "Revelation" }
    ];

    const results = [];

    // 1. All Bible Verses
    for (const book of bibleBooks) {
        try {
            // Map 'psalm' slug to 'psalms.json' file
           const fileName = book.slug === 'psalm' ? 'psalms' : book.slug;
           const raw = readJson(`data/books/${fileName}.json`);
           for (const [chapterNum, chapterData] of Object.entries(raw.chapters)) {
               for (const [verseNum, verseData] of Object.entries(chapterData)) {
                    results.push({
                       type: "verse",
                        title: verseData.reference,
                        text: verseData.text,
                        href: `/bible/${book.slug}/${chapterNum}/#verse${verseNum}`,
                    });
                }
            }
        } catch(e) {
           console.error(`Error loading book ${book.slug}:`, e.message);
        }
    }

    // 2. Daily Verses
    try {
        const versesData = readJson('data/verses.json');
        for (const [date, verse] of Object.entries(versesData)) {
            results.push({
                type: "verse",
                title: verse.ref,
                text: verse.text,
                href: `/verse-of-the-day/${date}/`,
            });
        }
    } catch (e) { console.error("Error loading daily verses:", e.message); }

    // 3. Topics
    try {
        const topicsData = readJson('data/topics.json');
        for (const topic of topicsData) {
            results.push({
                type: "topic",
                title: topic.title,
                text: rewriteVerseLinks(topic.description),
                href: `/topics/${topic.slug}/`,
            });
            for (const v of topic.verses) {
                results.push({
                    type: "verse",
                    title: v.ref,
                    text: v.text,
                    href: `/topics/${topic.slug}/`,
                });
            }
        }
    } catch (e) { console.error("Error loading topics:", e.message); }

    // 4. Blog Posts
    try {
        const { GraphQLClient, gql } = await import('graphql-request');
        const API_URL = 'https://blog.prayerverses.com/graphql';
        const client = new GraphQLClient(API_URL);

        const query = gql`
            query GetAllPosts($after: String) {
                posts(first: 100, after: $after) {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    nodes {
                        title
                        slug
                        excerpt
                    }
                }
            }
        `;

        let hasNextPage = true;
        let after = null;
        let postCount = 0;

        while (hasNextPage) {
            const response = await client.request(query, { after });
            const posts = response.posts.nodes;
            
            for (const post of posts) {
                results.push({
                    type: "post",
                    title: post.title,
                    text: post.excerpt ? post.excerpt.replace(/<[^>]*>?/gm, '') : "",
                    href: `/${post.slug}/`,
                });
                postCount++;
            }

            hasNextPage = response.posts.pageInfo.hasNextPage;
            after = response.posts.pageInfo.endCursor;
        }
        console.log(`Indexed ${postCount} blog posts.`);
    } catch (e) {
        console.error("Error loading blog posts for search index:", e.message);
    }

    const outputPath = path.join(rootDir, 'public', 'search-index.json');
    fs.writeFileSync(outputPath, JSON.stringify(results));
    console.log(`Search index generated at ${outputPath} (${results.length} items)`);
}

generateIndex();
