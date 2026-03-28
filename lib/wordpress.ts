import { GraphQLClient, gql } from 'graphql-request';
import { cache } from 'react';
import categoriesBackup from '@/data/categories-backup.json';

const API_URL = 'https://blog.prayerverses.com/graphql';

const client = new GraphQLClient(API_URL);

// Global cache for categories to survive across multiple requests in the same build process/worker
let globalCategoriesCache: Category[] | null = null;
let categoriesPromise: Promise<Category[]> | null = null;

// Circuit breaker: stop trying the API if it's consistently failing to avoid timing out the entire build
let isWpApiDown = false;

/**
 * Wrapper for GraphQL requests with retry logic and shortened timeout for build safety
 */
async function requestWithRetry<T>(query: string, variables?: any, retries = 3): Promise<T | null> {
  if (isWpApiDown) {
      return null;
  }

  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      // Use a shorter timeout (8 seconds) to ensure total time with retries stays well under 60s
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const result = await client.request<T>(query, variables, {
        signal: controller.signal as any
      });
      
      clearTimeout(timeoutId);
      return result;
    } catch (err: any) {
      lastError = err;
      // If it's a timeout or connection error, wait and retry
      const isTimeout = err.name === 'AbortError' || err.message?.includes('timeout') || err.message?.includes('UND_ERR_CONNECT_TIMEOUT') || err.message?.includes('fetch failed');
      
      if (isTimeout && i < retries - 1) {
        console.warn(`Fetch attempt ${i + 1} failed, retrying in 2s...`, err.message);
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      
      console.error(`Fetch attempt ${i + 1} failed with error:`, err.message);
      if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
      }
    }
  }
  
  console.error('All fetch attempts failed. Activating circuit breaker (isWpApiDown = true).');
  isWpApiDown = true; // Mark as down for the remainder of this worker's life
  return null;
}

export interface SeoMetadata {
  title?: string;
  metaDesc?: string;
  focuskw?: string;
  canonical?: string;
  cornerstone?: boolean;
  fullHead?: string;
  opengraphAuthor?: string;
  opengraphDescription?: string;
  opengraphImage?: {
    sourceUrl: string;
  };
  opengraphModifiedTime?: string;
  opengraphPublishedTime?: string;
  opengraphPublisher?: string;
  opengraphSiteName?: string;
  opengraphTitle?: string;
  opengraphType?: string;
  opengraphUrl?: string;
  twitterDescription?: string;
  twitterImage?: {
    sourceUrl: string;
  };
  twitterTitle?: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  seo?: SeoMetadata;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  content?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  categories?: {
    nodes: Category[];
  };
  author?: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
    };
  };
  seo?: SeoMetadata;
  previous?: {
    title: string;
    slug: string;
  };
  next?: {
    title: string;
    slug: string;
  };
}

export interface PostConnection {
  nodes: Post[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
}

export interface PostSlugsResponse {
  posts: {
    pageInfo: { hasNextPage: boolean; endCursor: string };
    nodes: { slug: string }[];
  };
}

export const getCategories = cache(async (): Promise<Category[]> => {
  // Return from global cache if already fetched in this worker
  if (globalCategoriesCache) return globalCategoriesCache;
  
  // If a fetch is already in progress, wait for it
  if (categoriesPromise) return categoriesPromise;

  const query = gql`
    query GetCategories {
      categories(first: 100) {
        nodes {
          id
          name
          slug
          description
        }
      }
    }
  `;

  categoriesPromise = (async () => {
    try {
      const data = await requestWithRetry<{ categories: { nodes: Category[] } }>(query);
      if (!data) {
          console.warn('Using categories backup due to API failure.');
          return categoriesBackup as Category[];
      }
      
      const allowedSlugs = ['prayers', 'spiritual-meaning', 'verses-by-topic'];
      const categories = data.categories.nodes.filter(cat =>
        allowedSlugs.includes(cat.slug)
      );

      // Add Blog category
      categories.unshift({
        id: 'blog-category',
        name: 'Blog',
        slug: 'blog',
        description: 'Explore all our spiritual blog posts, prayers, and biblical insights in one place.'
      });

      globalCategoriesCache = categories;
      return categories;
    } catch (err) {
      console.error('Error in getCategories, using backup:', err);
      return categoriesBackup as Category[];
    }
  })();

  return categoriesPromise;
});

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  if (slug === 'blog') {
    return {
      id: 'blog-category',
      name: 'Blog',
      slug: 'blog',
      description: 'Explore all our spiritual blog posts, prayers, and biblical insights in one place.',
      seo: {
        title: 'Blog - PrayerVerses',
        metaDesc: 'Explore all our spiritual blog posts, prayers, and biblical insights in one place.',
        canonical: 'https://prayerverses.com/category/blog/'
      }
    };
  }

  if (slug === 'bible-verses') {
    return null;
  }

  const query = gql`
    query GetCategoryBySlug($id: ID!) {
      category(id: $id, idType: SLUG) {
        id
        name
        slug
        description
        seo {
          title
          metaDesc
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
          canonical
        }
      }
    }
  `;
  try {
    const data = await requestWithRetry<{ category: Category | null }>(query, { id: slug });
    let category = data?.category ?? null;

    if (!category) {
      console.warn(`Falling back to local data for category: ${slug}`);
      category = (categoriesBackup as Category[]).find(c => c.slug === slug) || null;
    }

    return category;
  } catch (err) {
    console.error('Error in getCategoryBySlug, using backup:', err);
    return (categoriesBackup as Category[]).find(c => c.slug === slug) || null;
  }
});

export const getPostsByCategory = cache(async (categorySlug: string, first = 21, after?: string): Promise<PostConnection> => {
  if (categorySlug === 'blog') {
    return getNewestPosts(first, after);
  }

  const query = gql`
    query GetPostsByCategory($categoryName: String!, $first: Int!, $after: String) {
      posts(where: { categoryName: $categoryName }, first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;
  const data = await requestWithRetry<{ posts: PostConnection }>(query, {
    categoryName: categorySlug,
    first,
    after
  });
  return data?.posts ?? { nodes: [], pageInfo: { hasNextPage: false, endCursor: '' } };
});

async function getNeighborPost(date: string, direction: 'previous' | 'next'): Promise<{ title: string; slug: string } | undefined> {
  const query = gql`
    query GetNeighborPost($date: String!, $order: OrderEnum!, $compare: String!) {
      posts(
        first: 1, 
        where: { 
          dateQuery: { 
            column: DATE, 
            before: $compare === 'before' ? { date: $date } : null,
            after: $compare === 'after' ? { date: $date } : null
          },
          orderby: { field: DATE, order: $order }
        }
      ) {
        nodes {
          title
          slug
        }
      }
    }
  `;

  const d = new Date(date);
  const dateObj = {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };

  const neighborQuery = direction === 'next'
    ? gql`
        query GetNextPost($year: Int!, $month: Int!, $day: Int!) {
          posts(first: 1, where: { 
            dateQuery: { 
              after: { year: $year, month: $month, day: $day }, 
              column: DATE 
            }, 
            orderby: { field: DATE, order: ASC } 
          }) {
            nodes { title, slug }
          }
        }
      `
    : gql`
        query GetPreviousPost($year: Int!, $month: Int!, $day: Int!) {
          posts(first: 1, where: { 
            dateQuery: { 
              before: { year: $year, month: $month, day: $day }, 
              column: DATE 
            }, 
            orderby: { field: DATE, order: DESC } 
          }) {
            nodes { title, slug }
          }
        }
      `;

  try {
    const data = await requestWithRetry<{ posts: { nodes: { title: string; slug: string }[] } }>(neighborQuery, dateObj);
    return data?.posts.nodes[0];
  } catch (err) {
    console.error(`Error fetching ${direction} post:`, err);
    return undefined;
  }
}

import postsBackupData from '@/data/posts-backup.json';
const postsBackup = postsBackupData as unknown as Post[];

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const query = gql`
    query GetPostBySlug($id: ID!) {
      post(id: $id, idType: SLUG) {
        id
        title
        slug
        date
        content
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        seo {
          title
          metaDesc
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
          canonical
        }
      }
    }
  `;

  try {
    const data = await requestWithRetry<{ post: Post | null }>(query, { id: slug });
    let post = data?.post ?? null;

    if (!post) {
      console.warn(`Falling back to local data for post: ${slug}`);
      post = postsBackup.find(p => p.slug === slug) || null;
    }

    if (post && post.date) {
      // Fetch neighbors (only from API, if it fails, it's fine)
      const [prev, next] = await Promise.all([
        getNeighborPost(post.date, 'previous'),
        getNeighborPost(post.date, 'next')
      ]);

      post.previous = prev;
      post.next = next;
    }

    return post;
  } catch (err) {
    console.error('Error fetching post by slug, using fallback:', err);
    return postsBackup.find(p => p.slug === slug) || null;
  }
});
export const getNewestPosts = cache(async (first = 21, after?: string): Promise<PostConnection> => {
  const query = gql`
    query GetNewestPosts($first: Int!, $after: String) {
      posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;
  const data = await requestWithRetry<{ posts: PostConnection }>(query, { first, after });
  return data?.posts ?? { nodes: [], pageInfo: { hasNextPage: false, endCursor: '' } };
});

export const getRelatedPosts = cache(async (categorySlug: string, currentPostId: string, limit = 6): Promise<Post[]> => {
  const query = gql`
    query GetRelatedPosts($categoryName: String!, $first: Int!) {
      posts(where: { categoryName: $categoryName }, first: $first) {
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const data = await requestWithRetry<{ posts: { nodes: Post[] } }>(query, {
      categoryName: categorySlug,
      first: limit + 1 // Get one extra in case current is included
    });

    if (!data) return [];

    let related = data.posts.nodes.filter(post => post.id !== currentPostId).slice(0, limit);

    return related;
  } catch (err) {
    console.error('Error fetching related posts:', err);
    return [];
  }
});

export const getRandomPostFromCategory = cache(async (categorySlug: string, excludePostId: string): Promise<Post | null> => {
  const query = gql`
    query GetPostsFromCategory($categoryName: String!, $first: Int!) {
      posts(where: { categoryName: $categoryName }, first: $first) {
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    // Fetch more posts to have a good pool to randomly select from
    const data = await requestWithRetry<{ posts: { nodes: Post[] } }>(query, {
      categoryName: categorySlug,
      first: 20
    });

    if (!data) return null;

    const filtered = data.posts.nodes.filter(post => post.id !== excludePostId);
    
    if (filtered.length === 0) return null;

    // Random selection
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  } catch (err) {
    console.error('Error fetching random post from category:', err);
    return null;
  }
});

export const getAllPostSlugs = cache(async (): Promise<{ slug: string }[]> => {
  const query = gql`
    query GetAllPostSlugs($after: String) {
      posts(first: 100, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          slug
        }
      }
    }
  `;

  let allSlugs: { slug: string }[] = [];
  let hasNextPage = true;
  let after = null;

  try {
    while (hasNextPage) {
      const response: PostSlugsResponse | null = await requestWithRetry<PostSlugsResponse>(query, { after });

      if (!response) {
        hasNextPage = false;
        continue;
      }

      allSlugs = [...allSlugs, ...response.posts.nodes];
      hasNextPage = response.posts.pageInfo.hasNextPage;
      after = response.posts.pageInfo.endCursor;
    }
    return allSlugs;
  } catch (err) {
    console.error('Error fetching all post slugs:', err);
    return [];
  }
});
