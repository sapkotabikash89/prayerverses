'use client';

import { useState } from 'react';
import { Post, PostConnection } from '@/lib/wordpress';
import { BlogPostCard } from './blog-post-card';
import { fetchMorePosts } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PostGridProps {
    initialPosts: Post[];
    initialPageInfo: PostConnection['pageInfo'];
    categorySlug: string;
}

export function PostGrid({ initialPosts, initialPageInfo, categorySlug }: PostGridProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [pageInfo, setPageInfo] = useState(initialPageInfo);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadMore = async () => {
        setIsLoading(true);
        try {
            const nextData = await fetchMorePosts(categorySlug, pageInfo.endCursor);
            setPosts([...posts, ...nextData.nodes]);
            setPageInfo(nextData.pageInfo);
        } catch (error) {
            console.error('Error loading more posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>

            {pageInfo.hasNextPage && (
                <div className="mt-12 flex justify-center">
                    <Button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        size="lg"
                        className="min-w-[200px] font-bold text-lg rounded-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Load More'
                        )}
                    </Button>
                </div>
            )}
        </>
    );
}
