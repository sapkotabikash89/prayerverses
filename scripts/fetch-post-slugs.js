const fs = require('fs');
const path = require('path');
const { GraphQLClient, gql } = require('graphql-request');

const API_URL = 'https://blog.prayerverses.com/graphql';
const client = new GraphQLClient(API_URL);

async function fetchAllPostSlugs() {
  const query = gql`
   query GetAllPostSlugs($after: String) {
      posts(first: 100, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          slug
          modified
        }
      }
    }
  `;

  let allSlugs = [];
  let hasNextPage = true;
  let after = null;

  try {
    while (hasNextPage) {
     const response = await client.request(query, { after });
     allSlugs = [...allSlugs, ...response.posts.nodes];
      hasNextPage = response.posts.pageInfo.hasNextPage;
      after = response.posts.pageInfo.endCursor;
     console.log(`Fetched ${allSlugs.length} slugs so far...`);
    }
    
    // Write to file
   const outputPath = path.join(__dirname, '..', 'data', 'post-slugs.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(allSlugs, null, 2),
      'utf-8'
    );
    
   console.log(`Successfully saved ${allSlugs.length} post slugs to ${outputPath}`);
    return allSlugs;
  } catch (err) {
   console.error('Error fetching post slugs:', err.message);
   process.exit(1);
  }
}

fetchAllPostSlugs();
