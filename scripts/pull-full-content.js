
const fs = require('fs');
const path = require('path');
const { GraphQLClient, gql } = require('graphql-request');

const API_URL = 'https://blog.prayerverses.com/graphql';
const client = new GraphQLClient(API_URL);

async function fetchAllPostsFull() {
  const query = gql`
    query GetAllPostsFull($after: String) {
      posts(first: 50, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
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
      console.log(`Pulled ${allPosts.length} posts...`);
    }
    return allPosts;
  } catch (err) {
    console.error(`Error pulling posts:`, err.message);
    return [];
  }
}

async function run() {
  const posts = await fetchAllPostsFull();
  const outputPath = path.join(__dirname, '..', 'data', 'posts-backup.json');
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  console.log(`Saved ${posts.length} posts to ${outputPath}`);
}

run();
