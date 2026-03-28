
import { Post, PostConnection } from './wordpress';

/**
 * Client-side fetcher for more posts from the pre-generated static JSON API.
 * This replaces the Server Action and direct WordPress GraphQL calls to ensure 
 * static export compatibility and avoid CORS issues.
 */
export async function fetchMorePosts(categorySlug: string, offset: number): Promise<PostConnection> {
    try {
        // Fetch from the static JSON files generated during build
        // Note: Using relative path from the public root during production
        const response = await fetch(`/api/categories/${categorySlug}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load posts for ${categorySlug}`);
        }
        
        const allPosts: Post[] = await response.json();
        
        const pageSize = 21;
        const nextNodes = allPosts.slice(offset, offset + pageSize);
        const hasNextPage = allPosts.length > offset + pageSize;
        
        return {
            nodes: nextNodes,
            pageInfo: {
                hasNextPage,
                // We use the count as the new endCursor since we are slicing statically
                endCursor: (offset + pageSize).toString()
            }
        };
    } catch (err) {
        console.error('fetchMorePosts failed, falling back to empty:', err);
        return {
            nodes: [],
            pageInfo: {
                hasNextPage: false,
                endCursor: ''
            }
        };
    }
}
