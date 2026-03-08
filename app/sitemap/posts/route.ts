import { GraphQLClient, gql } from 'graphql-request'
import { NextResponse } from 'next/server'

const BASE = 'https://prayerverses.com'
const WP_API = 'https://blog.prayerverses.com/graphql'

/**
 * Sitemap 2 — Blog posts
 * Served at /sitemap/posts
 * Fetches ALL published post slugs and dates from WordPress.
 * Excludes category pages and noindex content.
 */
export async function GET() {
    const client = new GraphQLClient(WP_API)
    const query = gql`
    query GetAllPostSlugs {
      posts(first: 2000, where: { status: PUBLISH }) {
        nodes {
          slug
          date
          modified
        }
      }
    }
  `

    let posts: { slug: string; date: string; modified: string }[] = []
    try {
        const data = await client.request<{
            posts: { nodes: { slug: string; date: string; modified: string }[] }
        }>(query)
        posts = data.posts.nodes
    } catch (err) {
        console.error('Sitemap: failed to fetch posts', err)
    }

    const urls = posts
        .map((post) => {
            const lastMod = post.modified || post.date
            return `
  <url>
    <loc>${BASE}/${post.slug}/</loc>
    <lastmod>${new Date(lastMod).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
        })
        .join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=86400, stale-while-revalidate',
        },
    })
}
