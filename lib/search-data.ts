import versesData from "@/data/verses.json"
import topicsData from "@/data/topics.json"
import { getAllVerses } from "./bible-text"
import { getSemanticKeywords } from "./bible-semantics"
import { rewriteVerseLinks } from "./link-utils"

export type MatchType = "phrase" | "exact" | "keywords" | "grammatical" | "theme" | "related" | "other"

export interface SearchResult {
  type: "verse" | "topic" | "spiritual"
  title: string
  text: string
  href: string
  matchType?: MatchType
}

export async function buildSearchIndex(): Promise<SearchResult[]> {
  const results: SearchResult[] = []

  // All Bible Verses from /data/books
  const bibleVerses = await getAllVerses()
  for (const v of bibleVerses) {
    results.push({
      type: "verse",
      title: v.reference,
      text: v.text,
      href: `/bible/${v.bookSlug}/${v.chapter}/#verse${v.verse}`,
    })
  }

  // Daily verses
  const verses = versesData as Record<string, { text: string; ref: string }>
  for (const [date, verse] of Object.entries(verses)) {
    results.push({
      type: "verse",
      title: verse.ref,
      text: verse.text,
      href: `/verse-of-the-day/${date}/`,
    })
  }

  // Topics and their verses
  for (const topic of topicsData) {
    results.push({
      type: "topic",
      title: topic.title,
      text: rewriteVerseLinks(topic.description),
      href: `/topics/${topic.slug}/`,
    })
    for (const v of topic.verses) {
      results.push({
        type: "verse",
        title: v.ref,
        text: v.text,
        href: `/topics/${topic.slug}/`,
      })
    }
  }


  return results
}

export function searchContent(query: string, index: SearchResult[]): SearchResult[] {
  if (!query.trim()) return []
  const originalLower = query.toLowerCase().trim()

  // Stop words to ignore in keyword matching
  const stopWords = new Set(["of", "and", "the", "in", "to", "for", "with", "is", "a", "an", "on", "by", "that", "this"])

  // Tokenize query
  const tokens = originalLower.split(/\s+/).filter(t => t.length > 0)
  const keyTokens = tokens.filter(t => !stopWords.has(t))

  // 1. Exact Phrase Matching (Highest Priority)
  const phraseMatches: SearchResult[] = []
  const phraseRegex = new RegExp(originalLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")

  // 2. Exact Keyword Matching (All keywords must exist)
  const keywordMatches: SearchResult[] = []
  const keywordRegexes = keyTokens.map(t => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"))

  // 3. Single Word Exact Match (Backward compatibility for single words)
  const singleExactMatches: SearchResult[] = []
  const singleExactRegex = tokens.length === 1 ? new RegExp(`\\b${tokens[0]}\\b`, "i") : null

  const others: SearchResult[] = []

  for (const item of index) {
    const combinedText = `${item.title} ${item.text}`.toLowerCase()

    // Check phrase match
    if (phraseRegex.test(combinedText)) {
      phraseMatches.push({ ...item, matchType: "phrase" })
      continue
    }

    // Check keyword AND match (only if multiple tokens)
    if (keyTokens.length > 1) {
      const allKeywordsMatch = keywordRegexes.every(regex => regex.test(combinedText))
      if (allKeywordsMatch) {
        keywordMatches.push({ ...item, matchType: "keywords" })
        continue
      }
    }

    // Check single exact match
    if (singleExactRegex && singleExactRegex.test(combinedText)) {
      singleExactMatches.push({ ...item, matchType: "exact" })
      continue
    }

    // Check partial matches for "others"
    if (combinedText.includes(originalLower) || tokens.some(t => combinedText.includes(t))) {
      others.push({ ...item, matchType: "other" })
    }
  }

  // Deduplicate helper
  const seen = new Set<string>()
  const deduplicate = (results: SearchResult[]) => {
    return results.filter(item => {
      const key = `${item.title}-${item.href}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const finalPhrase = deduplicate(phraseMatches)
  const finalKeywords = deduplicate(keywordMatches)
  const finalSingleExact = deduplicate(singleExactMatches)

  // Combined exact results
  let combinedExact = [...finalPhrase, ...finalKeywords, ...finalSingleExact]

  // 4. Result Count Rule (Stop if >= 50)
  if (combinedExact.length >= 50) {
    return combinedExact
  }

  // 5. Advanced Expansion Logic (Grammatical, Theme, Related)
  const grammaticalMatches: SearchResult[] = []
  const themeMatches: SearchResult[] = []
  const relatedMatches: SearchResult[] = []

  // Get semantics for all tokens
  for (const token of tokens) {
    if (stopWords.has(token)) continue

    const semantics = getSemanticKeywords(token)
    if (!semantics) continue

    const gramRegex = semantics.variations.length > 0 ? new RegExp(`\\b(${semantics.variations.join("|")})\\b`, "i") : null
    const themeRegex = semantics.themes.length > 0 ? new RegExp(`\\b(${semantics.themes.join("|")})\\b`, "i") : null
    const relRegex = semantics.related.length > 0 ? new RegExp(`\\b(${semantics.related.join("|")})\\b`, "i") : null

    for (const item of index) {
      const key = `${item.title}-${item.href}`
      if (seen.has(key)) continue

      const combinedText = `${item.title} ${item.text}`

      if (gramRegex && gramRegex.test(combinedText)) {
        grammaticalMatches.push({ ...item, matchType: "grammatical" })
        seen.add(key)
      } else if (themeRegex && themeRegex.test(combinedText)) {
        themeMatches.push({ ...item, matchType: "theme" })
        seen.add(key)
      } else if (relRegex && relRegex.test(combinedText)) {
        relatedMatches.push({ ...item, matchType: "related" })
        seen.add(key)
      }
    }
  }

  // Build final results based on priority
  let combined = [...combinedExact]

  if (combined.length < 50) {
    combined = [...combined, ...grammaticalMatches]
  }
  if (combined.length < 50) {
    combined = [...combined, ...themeMatches]
  }
  if (combined.length < 50) {
    combined = [...combined, ...relatedMatches]
  }

  // Finally add other partial matches if still under 50
  if (combined.length < 50) {
    const filteredOthers = others.filter(item => !seen.has(`${item.title}-${item.href}`))
    combined = [...combined, ...filteredOthers]
  }

  return combined
}
