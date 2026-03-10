import type { MetadataRoute } from "next"
import { GraphQLClient, gql } from 'graphql-request'

export const dynamic = "force-static"

const BASE = "https://prayerverses.com"
const WP_API = "https://blog.prayerverses.com/graphql"

/**
 * Sitemap 2 — Blog posts
 * Served at /sitemap/posts/sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  return posts.map((post) => ({
    url: `${BASE}/${post.slug}/`,
    lastModified: new Date(post.modified || post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }))
}
