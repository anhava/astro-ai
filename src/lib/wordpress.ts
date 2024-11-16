import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.WORDPRESS_API_URL || 'https://aihio.pro/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${process.env.WORDPRESS_AUTH_TOKEN}`,
  },
});

export async function getPosts() {
  const query = `
    query Posts {
      posts {
        nodes {
          id
          title
          excerpt
          slug
          date
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

  const data = await graphqlClient.request(query);
  return data.posts.nodes;
}