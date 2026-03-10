import { bibleBooks } from "@/data/bible"
import verseData from "@/data/verse-data.json"

type RawVerse = {
  verseId: string
  reference: string
  text: string
}

type RawBook = {
  book: string
  chapters: Record<string, Record<string, RawVerse>>
}

export type BibleVerse = {
  verseId: string
  bookSlug: string
  bookName: string
  chapter: number
  verse: number
  reference: string
  text: string
}

type BookLoader = () => Promise<RawBook>

const BOOK_LOADERS: Record<string, BookLoader> = {
  "genesis": () =>
    import("@/data/books/genesis.json").then((m) => m.default as RawBook),
  "exodus": () =>
    import("@/data/books/exodus.json").then((m) => m.default as RawBook),
  "leviticus": () =>
    import("@/data/books/leviticus.json").then((m) => m.default as RawBook),
  "numbers": () =>
    import("@/data/books/numbers.json").then((m) => m.default as RawBook),
  "deuteronomy": () =>
    import("@/data/books/deuteronomy.json").then((m) => m.default as RawBook),
  "joshua": () =>
    import("@/data/books/joshua.json").then((m) => m.default as RawBook),
  "judges": () =>
    import("@/data/books/judges.json").then((m) => m.default as RawBook),
  "ruth": () =>
    import("@/data/books/ruth.json").then((m) => m.default as RawBook),
  "1-samuel": () =>
    import("@/data/books/1-samuel.json").then((m) => m.default as RawBook),
  "2-samuel": () =>
    import("@/data/books/2-samuel.json").then((m) => m.default as RawBook),
  "1-kings": () =>
    import("@/data/books/1-kings.json").then((m) => m.default as RawBook),
  "2-kings": () =>
    import("@/data/books/2-kings.json").then((m) => m.default as RawBook),
  "1-chronicles": () =>
    import("@/data/books/1-chronicles.json").then((m) => m.default as RawBook),
  "2-chronicles": () =>
    import("@/data/books/2-chronicles.json").then((m) => m.default as RawBook),
  "ezra": () =>
    import("@/data/books/ezra.json").then((m) => m.default as RawBook),
  "nehemiah": () =>
    import("@/data/books/nehemiah.json").then((m) => m.default as RawBook),
  "esther": () =>
    import("@/data/books/esther.json").then((m) => m.default as RawBook),
  "job": () =>
    import("@/data/books/job.json").then((m) => m.default as RawBook),
  "psalms": () =>
    import("@/data/books/psalms.json").then((m) => m.default as RawBook),
  "proverbs": () =>
    import("@/data/books/proverbs.json").then((m) => m.default as RawBook),
  "ecclesiastes": () =>
    import("@/data/books/ecclesiastes.json").then((m) => m.default as RawBook),
  "song-of-solomon": () =>
    import("@/data/books/song-of-solomon.json").then(
      (m) => m.default as RawBook,
    ),
  "isaiah": () =>
    import("@/data/books/isaiah.json").then((m) => m.default as RawBook),
  "jeremiah": () =>
    import("@/data/books/jeremiah.json").then((m) => m.default as RawBook),
  "lamentations": () =>
    import("@/data/books/lamentations.json").then(
      (m) => m.default as RawBook,
    ),
  "ezekiel": () =>
    import("@/data/books/ezekiel.json").then((m) => m.default as RawBook),
  "daniel": () =>
    import("@/data/books/daniel.json").then((m) => m.default as RawBook),
  "hosea": () =>
    import("@/data/books/hosea.json").then((m) => m.default as RawBook),
  "joel": () =>
    import("@/data/books/joel.json").then((m) => m.default as RawBook),
  "amos": () =>
    import("@/data/books/amos.json").then((m) => m.default as RawBook),
  "obadiah": () =>
    import("@/data/books/obadiah.json").then((m) => m.default as RawBook),
  "jonah": () =>
    import("@/data/books/jonah.json").then((m) => m.default as RawBook),
  "micah": () =>
    import("@/data/books/micah.json").then((m) => m.default as RawBook),
  "nahum": () =>
    import("@/data/books/nahum.json").then((m) => m.default as RawBook),
  "habakkuk": () =>
    import("@/data/books/habakkuk.json").then((m) => m.default as RawBook),
  "zephaniah": () =>
    import("@/data/books/zephaniah.json").then((m) => m.default as RawBook),
  "haggai": () =>
    import("@/data/books/haggai.json").then((m) => m.default as RawBook),
  "zechariah": () =>
    import("@/data/books/zechariah.json").then((m) => m.default as RawBook),
  "malachi": () =>
    import("@/data/books/malachi.json").then((m) => m.default as RawBook),
  "matthew": () =>
    import("@/data/books/matthew.json").then((m) => m.default as RawBook),
  "mark": () =>
    import("@/data/books/mark.json").then((m) => m.default as RawBook),
  "luke": () =>
    import("@/data/books/luke.json").then((m) => m.default as RawBook),
  "john": () =>
    import("@/data/books/john.json").then((m) => m.default as RawBook),
  "acts": () =>
    import("@/data/books/acts.json").then((m) => m.default as RawBook),
  "romans": () =>
    import("@/data/books/romans.json").then((m) => m.default as RawBook),
  "1-corinthians": () =>
    import("@/data/books/1-corinthians.json").then(
      (m) => m.default as RawBook,
    ),
  "2-corinthians": () =>
    import("@/data/books/2-corinthians.json").then(
      (m) => m.default as RawBook,
    ),
  "galatians": () =>
    import("@/data/books/galatians.json").then((m) => m.default as RawBook),
  "ephesians": () =>
    import("@/data/books/ephesians.json").then((m) => m.default as RawBook),
  "philippians": () =>
    import("@/data/books/philippians.json").then((m) => m.default as RawBook),
  "colossians": () =>
    import("@/data/books/colossians.json").then((m) => m.default as RawBook),
  "1-thessalonians": () =>
    import("@/data/books/1-thessalonians.json").then(
      (m) => m.default as RawBook,
    ),
  "2-thessalonians": () =>
    import("@/data/books/2-thessalonians.json").then(
      (m) => m.default as RawBook,
    ),
  "1-timothy": () =>
    import("@/data/books/1-timothy.json").then((m) => m.default as RawBook),
  "2-timothy": () =>
    import("@/data/books/2-timothy.json").then((m) => m.default as RawBook),
  "titus": () =>
    import("@/data/books/titus.json").then((m) => m.default as RawBook),
  "philemon": () =>
    import("@/data/books/philemon.json").then((m) => m.default as RawBook),
  "hebrews": () =>
    import("@/data/books/hebrews.json").then((m) => m.default as RawBook),
  "james": () =>
    import("@/data/books/james.json").then((m) => m.default as RawBook),
  "1-peter": () =>
    import("@/data/books/1-peter.json").then((m) => m.default as RawBook),
  "2-peter": () =>
    import("@/data/books/2-peter.json").then((m) => m.default as RawBook),
  "1-john": () =>
    import("@/data/books/1-john.json").then((m) => m.default as RawBook),
  "2-john": () =>
    import("@/data/books/2-john.json").then((m) => m.default as RawBook),
  "3-john": () =>
    import("@/data/books/3-john.json").then((m) => m.default as RawBook),
  "jude": () =>
    import("@/data/books/jude.json").then((m) => m.default as RawBook),
  "revelation": () =>
    import("@/data/books/revelation.json").then((m) => m.default as RawBook),
}

async function loadBook(bookSlug: string): Promise<RawBook | null> {
  // Map 'psalm' slug to 'psalms' for loading JSON file
  const normalizedSlug = bookSlug === 'psalm' ? 'psalms' : bookSlug
  const loader = BOOK_LOADERS[normalizedSlug]
  if (!loader) return null
 return loader()
}

export async function getChapterVerses(
  bookSlug: string,
  chapter: number,
): Promise<BibleVerse[] | null> {
  const raw = await loadBook(bookSlug)
  if (!raw) return null

  const chapterKey = String(chapter)
  const chapterData = raw.chapters[chapterKey]
  if (!chapterData) return null

  const bookMeta = bibleBooks.find((b) => b.slug === bookSlug)
  const bookName = bookMeta?.name ?? raw.book

  const verses: BibleVerse[] = []
  for (const [verseNum, verseData] of Object.entries(chapterData)) {
    const verse = parseInt(verseNum, 10)
    if (Number.isNaN(verse)) continue
    verses.push({
      verseId: verseData.verseId,
      bookSlug,
      bookName,
      chapter,
      verse,
      reference: verseData.reference,
      text: verseData.text,
    })
  }

  verses.sort((a, b) => a.verse - b.verse)
  return verses
}

export function parseVerseId(verseId: string) {
  const parts = verseId.split("-")
  if (parts.length < 3) return null
  const verseStr = parts.pop() as string
  const chapterStr = parts.pop() as string
  const bookSlug = parts.join("-")
  const chapter = parseInt(chapterStr, 10)
  const verse = parseInt(verseStr, 10)
  if (!bookSlug || Number.isNaN(chapter) || Number.isNaN(verse)) return null
  return { bookSlug, chapter, verse }
}

export async function getVerseById(
  verseId: string,
): Promise<BibleVerse | null> {
  const parsed = parseVerseId(verseId)
  if (!parsed) return null
  const { bookSlug, chapter, verse } = parsed
  const book = await loadBook(bookSlug)
  if (!book) return null
  const chapterData = book.chapters[String(chapter)]
  if (!chapterData) return null
  const verseData = chapterData[String(verse)]
  if (!verseData) return null

  const bookMeta = bibleBooks.find((b) => b.slug === bookSlug)
  const bookName = bookMeta?.name ?? book.book

  return {
    verseId: verseData.verseId,
    bookSlug,
    bookName,
    chapter,
    verse,
    reference: verseData.reference,
    text: verseData.text,
  }
}

type ParsedReference = {
  bookSlug: string
  bookName: string
  chapter: number
  startVerse: number
  endVerse: number
}

function parseReference(ref: string): ParsedReference | null {
  const match = ref.match(/^(.+)\s+(\d+):(\d+)(?:-(\d+))?$/)
  if (!match) return null
  const [, rawBookName, chapterStr, verseStr, endVerseStr] = match
  let bookName = rawBookName.trim()

  if (bookName === "Psalm") {
    bookName = "Psalms"
  }

  const bookMeta = bibleBooks.find((b) => b.name === bookName)
  if (!bookMeta) return null

  const chapter = parseInt(chapterStr, 10)
  const startVerse = parseInt(verseStr, 10)
  const endVerse = endVerseStr ? parseInt(endVerseStr, 10) : startVerse

  if (
    Number.isNaN(chapter) ||
    Number.isNaN(startVerse) ||
    Number.isNaN(endVerse)
  ) {
    return null
  }

  return {
    bookSlug: bookMeta.slug,
    bookName: bookMeta.name,
    chapter,
    startVerse,
    endVerse,
  }
}

export async function getVersesForReference(
  ref: string,
): Promise<BibleVerse[] | null> {
  const parsed = parseReference(ref)
  if (!parsed) return null

  const { bookSlug, chapter, startVerse, endVerse } = parsed
  const chapterVerses = await getChapterVerses(bookSlug, chapter)
  if (!chapterVerses) return null

  return chapterVerses.filter(
    (v) => v.verse >= startVerse && v.verse <= endVerse,
  )
}

export async function getAllVerseIds(): Promise<string[]> {
  const ids: string[] = []
  for (const book of bibleBooks) {
    const raw = await loadBook(book.slug)
    if (!raw) continue
    for (const chapterData of Object.values(raw.chapters)) {
      for (const verse of Object.values(chapterData)) {
        ids.push(verse.verseId)
      }
    }
  }
  return ids
}

export async function getAllVerses(): Promise<BibleVerse[]> {
  const allVerses: BibleVerse[] = []
  for (const book of bibleBooks) {
    const raw = await loadBook(book.slug)
    if (!raw) continue
    for (const [chapterNum, chapterData] of Object.entries(raw.chapters)) {
      const chapter = parseInt(chapterNum, 10)
      for (const [verseNum, verseData] of Object.entries(chapterData)) {
        const verse = parseInt(verseNum, 10)
        allVerses.push({
          verseId: verseData.verseId,
          bookSlug: book.slug,
          bookName: book.name,
          chapter,
          verse,
          reference: verseData.reference,
          text: verseData.text,
        })
      }
    }
  }
  return allVerses
}

export async function getPrevNextVerseIds(verseId: string) {
  const ids = await getAllVerseIds()
  const index = ids.indexOf(verseId)
  if (index === -1) return { prev: null, next: null }
  
  return {
    prev: index > 0 ? ids[index - 1] : null,
    next: index < ids.length - 1 ? ids[index + 1] : null,
  }
}

export async function getCustomVerseData(verseId: string) {
  const data = verseData as Record<string, any>
  return data[verseId] || null
}
