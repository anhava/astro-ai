## WordPress Integration Guide

This guide explains how to integrate WordPress content with your Astro blog.

### Prerequisites

1. A WordPress site with the following plugins installed:
   - WPGraphQL (for GraphQL API)
   - Advanced Custom Fields (ACF)
   - ACF to WPGraphQL

### WordPress Setup

1. Install required plugins:
```bash
# Via WordPress admin panel:
Plugins > Add New > Search and install:
- WPGraphQL
- Advanced Custom Fields
- ACF to WPGraphQL
```

2. Create Custom Post Types for different content:

```php
// Add to your theme's functions.php or custom plugin
function register_custom_post_types() {
    // Guides
    register_post_type('guide', [
        'label' => 'Guides',
        'public' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'guide',
        'graphql_plural_name' => 'guides',
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'has_archive' => true,
        'rewrite' => ['slug' => 'guides']
    ]);

    // News
    register_post_type('news', [
        'label' => 'News',
        'public' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'news',
        'graphql_plural_name' => 'news',
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'has_archive' => true,
        'rewrite' => ['slug' => 'news']
    ]);
}
add_action('init', 'register_custom_post_types');
```

3. Create Custom Fields:

Using ACF, create the following field groups:

```yaml
# Guides
- difficulty:
    type: select
    choices: [beginner, intermediate, advanced]
- duration:
    type: text
- icon:
    type: text

# News
- category:
    type: taxonomy
- readTime:
    type: text
```

### Astro Integration

1. Update GraphQL queries in `src/lib/wordpress.ts`:

```typescript
// Get Guides
export async function getGuides() {
  const query = `
    query Guides {
      guides {
        nodes {
          id
          title
          excerpt
          slug
          guide {
            difficulty
            duration
            icon
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  const data = await graphqlClient.request(query);
  return data.guides.nodes;
}

// Get News
export async function getNews() {
  const query = `
    query News {
      news {
        nodes {
          id
          title
          excerpt
          slug
          date
          news {
            category
            readTime
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  const data = await graphqlClient.request(query);
  return data.news.nodes;
}
```

2. Create WordPress content fetchers:

```typescript
// src/lib/content.ts
import { getGuides, getNews, getPosts } from './wordpress';

export async function getAllContent() {
  const [guides, news, posts] = await Promise.all([
    getGuides(),
    getNews(),
    getPosts()
  ]);

  return {
    guides: guides.map(formatGuide),
    news: news.map(formatNews),
    posts: posts.map(formatPost)
  };
}

function formatGuide(guide: any) {
  return {
    title: guide.title,
    description: guide.excerpt,
    difficulty: guide.guide.difficulty,
    duration: guide.guide.duration,
    icon: guide.guide.icon,
    href: `/guides/${guide.slug}`,
    image: guide.featuredImage?.node.sourceUrl
  };
}

function formatNews(news: any) {
  return {
    title: news.title,
    excerpt: news.excerpt,
    category: news.news.category,
    date: new Date(news.date),
    readTime: news.news.readTime,
    href: `/news/${news.slug}`,
    image: news.featuredImage?.node.sourceUrl
  };
}
```

### Usage in Components

Update your pages to fetch WordPress content:

```typescript
// src/pages/guides/index.astro
import { getGuides } from '../../lib/wordpress';

const guides = await getGuides();

// src/pages/news/index.astro
import { getNews } from '../../lib/wordpress';

const news = await getNews();
```

### Environment Variables

Make sure to set up your WordPress GraphQL endpoint:

```env
WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
WORDPRESS_AUTH_TOKEN=your_auth_token_here
```

### Security Considerations

1. Use environment variables for sensitive data
2. Implement proper authentication
3. Rate limit API requests
4. Cache responses when possible
5. Validate and sanitize WordPress content

### Performance Tips

1. Use static generation where possible
2. Implement content caching
3. Optimize images via WordPress
4. Use incremental static regeneration
5. Implement proper error handling

### Deployment

1. Set environment variables in your hosting platform
2. Configure build hooks for content updates
3. Set up proper caching headers
4. Monitor API performance and usage

Remember to keep your WordPress installation and plugins updated for security and compatibility.