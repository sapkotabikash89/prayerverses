"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Search as SearchIcon, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"
import { buildSearchIndex, searchContent, SearchResult, MatchType } from "@/lib/search-data"
import { getSemanticKeywords } from "@/lib/bible-semantics"

function HighlightText({ text, query, matchType }: { text: string; query: string; matchType?: MatchType }) {
  if (!query.trim()) return <>{text}</>

  const semantics = getSemanticKeywords(query.toLowerCase().trim())
  let highlightTerms = [query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")]

  if (matchType === "grammatical" && semantics) {
    highlightTerms = semantics.variations.map(v => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  } else if (matchType === "theme" && semantics) {
    highlightTerms = semantics.themes.map(v => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  } else if (matchType === "related" && semantics) {
    highlightTerms = semantics.related.map(v => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  } else if (matchType === "other") {
    // For partial matches, stick to query
  }

  const pattern = highlightTerms.length > 0 ? `(${highlightTerms.join("|")})` : query
  const parts = text.split(new RegExp(pattern, "gi"))

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = highlightTerms.some(term =>
          new RegExp(`^${term}$`, "i").test(part)
        )
        return isMatch ? (
          <span key={i} className="font-bold text-foreground">
            {part}
          </span>
        ) : (
          part
        )
      })}
    </>
  )
}

export default function SearchPage() {
  const [index, setIndex] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(20)

  useEffect(() => {
    async function loadIndex() {
      try {
        // Try to fetch pre-generated index first
        const response = await fetch('/search-index.json')
        if (response.ok) {
          const data = await response.json()
          setIndex(data)
        } else {
          // Fallback to building it on the fly (slow but functional)
          const data = await buildSearchIndex()
          setIndex(data)
        }
      } catch (error) {
        console.error("Failed to load search index:", error)
        // Secondary fallback
        try {
          const data = await buildSearchIndex()
          setIndex(data)
        } catch (innerError) {
          console.error("Deep fallback failed:", innerError)
        }
      } finally {
        setLoading(false)
      }
    }
    loadIndex()
  }, [])

  const results = useMemo(() => searchContent(query, index), [query, index])

  // Group results for UI display
  const groupedResults = useMemo(() => {
    const groups: Record<MatchType, SearchResult[]> = {
      phrase: [],
      exact: [],
      keywords: [],
      grammatical: [],
      theme: [],
      related: [],
      other: []
    }

    results.forEach(res => {
      const type = res.matchType || "other"
      groups[type].push(res)
    })

    return groups
  }, [results])

  const displayedResults = useMemo(() => results.slice(0, visibleCount), [results, visibleCount])

  useEffect(() => {
    setVisibleCount(20)
  }, [query])

  const typeLabels: Record<string, string> = {
    verse: "Verse",
    topic: "Topic",
    prayer: "Prayer",
    spiritual: "Spiritual",
  }

  return (
    <article className="post-content">
      <div className="py-8">
        <Breadcrumb items={[{ label: "Search", href: "/search/" }]} />
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-card-foreground mb-2 lg:text-4xl">
            Search the Bible
          </h1>
          <p className="text-muted-foreground text-center max-w-lg">
            Find verses, topics, and spiritual encouragement across the entire
            Scripture.
          </p>
        </div>

        <div className="relative mb-8">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={loading ? "Loading search index..." : "Search for a verse, topic, or keyword..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 py-3 text-base"
            autoFocus
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {query.trim() && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing {displayedResults.length} of {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
        )}

        <div className="flex flex-col gap-8">
          {Object.entries(groupedResults).map(([type, items]) => {
            if (items.length === 0) return null

            // Determine if we should show this item based on visibleCount
            // This is a bit tricky with groupings, but we'll prioritize exact match visibility
            const visibleItems = items.filter(item => {
              const indexInResults = results.indexOf(item)
              return indexInResults < visibleCount
            })

            if (visibleItems.length === 0) return null

            const headings: Record<string, string> = {
              phrase: "Exact Phrase Matches",
              exact: "Exact Word Matches",
              keywords: "Exact Keyword Matches",
              grammatical: "Grammatical Variations",
              theme: "Same Theme Verses",
              related: "Related Concept Verses",
              other: "Partial Matches"
            }

            return (
              <div key={type} className="flex flex-col gap-4">
                <h2 className="text-lg font-serif font-bold text-primary border-b border-border pb-2">
                  {headings[type]}
                </h2>
                <div className="flex flex-col gap-3">
                  {visibleItems.map((result, i) => (
                    <Link
                      key={`${type}-${i}`}
                      href={result.href}
                      className="group rounded-none border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {typeLabels[result.type]}
                        </Badge>
                        <h3 className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors">
                          <HighlightText text={result.title} query={query} matchType={result.matchType} />
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        <HighlightText text={result.text} query={query} matchType={result.matchType} />
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {results.length > visibleCount && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setVisibleCount((prev) => prev + 20)}
              className="w-full sm:w-auto"
            >
              Load More Results
            </Button>
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;. Try a different search
              term.
            </p>
          </div>
        )}
      </div>
    </article>
  )
}
