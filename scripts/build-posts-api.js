
const fs = require('fs');
const path = require('path');
const { GraphQLClient, gql } = require('graphql-request');

const API_URL = 'https://blog.prayerverses.com/graphql';
const client = new GraphQLClient(API_URL);

async function fetchAllPostsByCategory(categorySlug) {
  const query = gql`
    query GetPostsByCategory($categoryName: String!, $after: String) {
      posts(where: { categoryName: $categoryName }, first: 100, after: $after) {
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

  let allPosts = [];
  let hasNextPage = true;
  let after = null;

  try {
    while (hasNextPage) {
      const variables = { categoryName: categorySlug, after };
      const response = await client.request(query, variables);
      allPosts = [...allPosts, ...response.posts.nodes];
      hasNextPage = response.posts.pageInfo.hasNextPage;
      after = response.posts.pageInfo.endCursor;
    }
    return allPosts;
  } catch (err) {
    console.error(`Error fetching posts for category ${categorySlug}:`, err.message);
    return [];
  }
}

async function fetchAllNewestPosts() {
  const query = gql`
    query GetNewestPosts($after: String) {
      posts(first: 100, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
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

  let allPosts = [];
  let hasNextPage = true;
  let after = null;

  try {
    while (hasNextPage) {
      const response = await client.request(query, { after });
      allPosts = [...allPosts, ...response.posts.nodes];
      hasNextPage = response.posts.pageInfo.hasNextPage;
      after = response.posts.pageInfo.endCursor;
    }
    return allPosts;
  } catch (err) {
    console.error(`Error fetching newest posts:`, err.message);
    return [];
  }
}

async function buildPostsApi() {
  const categoriesPath = path.join(__dirname, '..', 'data', 'category-slugs.json');
  const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  
  const outputDir = path.join(__dirname, '..', 'public', 'api', 'categories');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const cat of categories) {
    console.log(`Pulling posts for category: ${cat.slug}...`);
    let posts = [];
    if (cat.slug === 'blog') {
      posts = await fetchAllNewestPosts();
    } else {
      posts = await fetchAllPostsByCategory(cat.slug);
    }
    
    fs.writeFileSync(
      path.join(outputDir, `${cat.slug}.json`),
      JSON.stringify(posts, null, 2),
      'utf-8'
    );
    console.log(`Saved ${posts.length} posts for ${cat.slug}`);
  }
}

buildPostsApi();
