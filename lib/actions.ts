import { getPostsByCategory, PostConnection } from './wordpress';

export async function fetchMorePosts(categorySlug: string, after: string): Promise<PostConnection> {
    return getPostsByCategory(categorySlug, 21, after);
}
