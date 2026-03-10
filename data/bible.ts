export interface BibleBook {
  slug: string
  name: string
  testament: "OT" | "NT"
  chapters: number
}

export const bibleBooks: BibleBook[] = [
  { slug: "genesis", name: "Genesis", testament: "OT", chapters: 50 },
  { slug: "exodus", name: "Exodus", testament: "OT", chapters: 40 },
  { slug: "leviticus", name: "Leviticus", testament: "OT", chapters: 27 },
  { slug: "numbers", name: "Numbers", testament: "OT", chapters: 36 },
  { slug: "deuteronomy", name: "Deuteronomy", testament: "OT", chapters: 34 },
  { slug: "joshua", name: "Joshua", testament: "OT", chapters: 24 },
  { slug: "judges", name: "Judges", testament: "OT", chapters: 21 },
  { slug: "ruth", name: "Ruth", testament: "OT", chapters: 4 },
  { slug: "1-samuel", name: "1 Samuel", testament: "OT", chapters: 31 },
  { slug: "2-samuel", name: "2 Samuel", testament: "OT", chapters: 24 },
  { slug: "1-kings", name: "1 Kings", testament: "OT", chapters: 22 },
  { slug: "2-kings", name: "2 Kings", testament: "OT", chapters: 25 },
  { slug: "1-chronicles", name: "1 Chronicles", testament: "OT", chapters: 29 },
  { slug: "2-chronicles", name: "2 Chronicles", testament: "OT", chapters: 36 },
  { slug: "ezra", name: "Ezra", testament: "OT", chapters: 10 },
  { slug: "nehemiah", name: "Nehemiah", testament: "OT", chapters: 13 },
  { slug: "esther", name: "Esther", testament: "OT", chapters: 10 },
  { slug: "job", name: "Job", testament: "OT", chapters: 42 },
  { slug: "psalm", name: "Psalms", testament: "OT", chapters: 150 },
  { slug: "proverbs", name: "Proverbs", testament: "OT", chapters: 31 },
  { slug: "ecclesiastes", name: "Ecclesiastes", testament: "OT", chapters: 12 },
  { slug: "song-of-solomon", name: "Song of Solomon", testament: "OT", chapters: 8 },
  { slug: "isaiah", name: "Isaiah", testament: "OT", chapters: 66 },
  { slug: "jeremiah", name: "Jeremiah", testament: "OT", chapters: 52 },
  { slug: "lamentations", name: "Lamentations", testament: "OT", chapters: 5 },
  { slug: "ezekiel", name: "Ezekiel", testament: "OT", chapters: 48 },
  { slug: "daniel", name: "Daniel", testament: "OT", chapters: 12 },
  { slug: "hosea", name: "Hosea", testament: "OT", chapters: 14 },
  { slug: "joel", name: "Joel", testament: "OT", chapters: 3 },
  { slug: "amos", name: "Amos", testament: "OT", chapters: 9 },
  { slug: "obadiah", name: "Obadiah", testament: "OT", chapters: 1 },
  { slug: "jonah", name: "Jonah", testament: "OT", chapters: 4 },
  { slug: "micah", name: "Micah", testament: "OT", chapters: 7 },
  { slug: "nahum", name: "Nahum", testament: "OT", chapters: 3 },
  { slug: "habakkuk", name: "Habakkuk", testament: "OT", chapters: 3 },
  { slug: "zephaniah", name: "Zephaniah", testament: "OT", chapters: 3 },
  { slug: "haggai", name: "Haggai", testament: "OT", chapters: 2 },
  { slug: "zechariah", name: "Zechariah", testament: "OT", chapters: 14 },
  { slug: "malachi", name: "Malachi", testament: "OT", chapters: 4 },
  { slug: "matthew", name: "Matthew", testament: "NT", chapters: 28 },
  { slug: "mark", name: "Mark", testament: "NT", chapters: 16 },
  { slug: "luke", name: "Luke", testament: "NT", chapters: 24 },
  { slug: "john", name: "John", testament: "NT", chapters: 21 },
  { slug: "acts", name: "Acts", testament: "NT", chapters: 28 },
  { slug: "romans", name: "Romans", testament: "NT", chapters: 16 },
  { slug: "1-corinthians", name: "1 Corinthians", testament: "NT", chapters: 16 },
  { slug: "2-corinthians", name: "2 Corinthians", testament: "NT", chapters: 13 },
  { slug: "galatians", name: "Galatians", testament: "NT", chapters: 6 },
  { slug: "ephesians", name: "Ephesians", testament: "NT", chapters: 6 },
  { slug: "philippians", name: "Philippians", testament: "NT", chapters: 4 },
  { slug: "colossians", name: "Colossians", testament: "NT", chapters: 4 },
  { slug: "1-thessalonians", name: "1 Thessalonians", testament: "NT", chapters: 5 },
  { slug: "2-thessalonians", name: "2 Thessalonians", testament: "NT", chapters: 3 },
  { slug: "1-timothy", name: "1 Timothy", testament: "NT", chapters: 6 },
  { slug: "2-timothy", name: "2 Timothy", testament: "NT", chapters: 4 },
  { slug: "titus", name: "Titus", testament: "NT", chapters: 3 },
  { slug: "philemon", name: "Philemon", testament: "NT", chapters: 1 },
  { slug: "hebrews", name: "Hebrews", testament: "NT", chapters: 13 },
  { slug: "james", name: "James", testament: "NT", chapters: 5 },
  { slug: "1-peter", name: "1 Peter", testament: "NT", chapters: 5 },
  { slug: "2-peter", name: "2 Peter", testament: "NT", chapters: 3 },
  { slug: "1-john", name: "1 John", testament: "NT", chapters: 5 },
  { slug: "2-john", name: "2 John", testament: "NT", chapters: 1 },
  { slug: "3-john", name: "3 John", testament: "NT", chapters: 1 },
  { slug: "jude", name: "Jude", testament: "NT", chapters: 1 },
  { slug: "revelation", name: "Revelation", testament: "NT", chapters: 22 },
]

export function getBookBySlug(slug: string): BibleBook | undefined {
  // Support both 'psalm' and 'psalms' for backward compatibility
 const normalizedSlug = slug === 'psalms' ? 'psalm' : slug
  return bibleBooks.find((b) => b.slug === normalizedSlug)
}

export function getBooksByTestament(testament: "OT" | "NT"): BibleBook[] {
  return bibleBooks.filter((b) => b.testament === testament)
}

export function referenceToFirstVerseId(ref: string): string | null {
  const match = ref.match(/^(.+)\s+(\d+):(\d+)/)
  if (!match) return null
  const [, rawBookName, chapterStr, verseStr] = match
  let bookName = rawBookName.trim()
  if (bookName === "Psalm") {
    bookName = "Psalms"
  }
  const bookMeta = bibleBooks.find((b) => b.name === bookName)
  if (!bookMeta) return null
  const chapter = parseInt(chapterStr, 10)
  const verse = parseInt(verseStr, 10)
  if (Number.isNaN(chapter) || Number.isNaN(verse)) return null
  return `${bookMeta.slug}-${chapter}-${verse}`
}
export function referenceToChapterHref(ref: string): string | null {
  const match = ref.match(/^(.+)\s+(\d+)(?::(\d+))?/)
  if (!match) return null
  const [, rawBookName, chapterStr, verseStr] = match
  let bookName = rawBookName.trim()
  if (bookName === "Psalm") {
    bookName = "Psalms"
  }
  const bookMeta = bibleBooks.find((b) => b.name === bookName)
  if (!bookMeta) return null
  const chapter = parseInt(chapterStr, 10)
  if (Number.isNaN(chapter)) return null

  // Use 'psalm' slug for Psalms book
  let slug = bookMeta.slug
  if (bookMeta.name === 'Psalms') {
  slug = 'psalm'
  }

  let href = `/bible/${slug}/${chapter}/`
  if (verseStr) {
    href += `#verse${verseStr}`
  }
  return href
}
