import type { MetadataRoute } from "next"

const BASE = "https://prayerverses.com"

/**
 * Sitemap 1 — Static & Bible pages
 * Includes: homepage, verse-of-the-day, random-verse, Bible books/chapters, legal pages.
 * Excludes: blog posts (see sitemap/posts.ts), category pages, search, noindex pages.
 *
 * Served at /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // ─── Homepage ────────────────────────────────────────────────────────────────
  entries.push({
    url: `${BASE}/`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  })

  // ─── Verse of the Day landing ─────────────────────────────────────────────
  entries.push({
    url: `${BASE}/verse-of-the-day/`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  })

  // ─── Random verse page ────────────────────────────────────────────────────
  entries.push({
    url: `${BASE}/random-verse/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  })

  // ─── Books of the Bible landing ───────────────────────────────────────────
  entries.push({
    url: `${BASE}/books-of-the-bible/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  })

  // ─── Legal / informational static pages ──────────────────────────────────
  const legalPages = [
    { path: "/about/", priority: 0.5 },
    { path: "/contact/", priority: 0.5 },
    { path: "/privacy-policy/", priority: 0.4 },
    { path: "/terms-of-service/", priority: 0.4 },
    { path: "/disclaimer/", priority: 0.4 },
  ]
  for (const { path, priority } of legalPages) {
    entries.push({
      url: `${BASE}${path}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority,
    })
  }

  return entries
}
