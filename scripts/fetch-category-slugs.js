const fs = require('fs');
const path = require('path');
const { GraphQLClient, gql } = require('graphql-request');

const API_URL = 'https://blog.prayerverses.com/graphql';
const client = new GraphQLClient(API_URL);

async function fetchCategorySlugs() {
  const query = gql`
    query GetCategories {
      categories(first: 100) {
        nodes {
          slug
        }
      }
    }
  `;

  try {
    const response = await client.request(query);
    const categorySlugs = response.categories.nodes
      .filter(cat => cat.slug !== 'uncategorized' && cat.slug !== 'bible-verses' && cat.slug !== 'blog')
      .map(cat => ({ slug: cat.slug }));

    // Add Blog category
    categorySlugs.unshift({ slug: 'blog' });

    const outputPath = path.join(__dirname, '..', 'data', 'category-slugs.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(categorySlugs, null, 2),
      'utf-8'
    );

    console.log(`Successfully saved ${categorySlugs.length} category slugs to ${outputPath}`);
  } catch (err) {
    console.error('Error fetching category slugs:', err.message);
    process.exit(1);
  }
}

fetchCategorySlugs();
