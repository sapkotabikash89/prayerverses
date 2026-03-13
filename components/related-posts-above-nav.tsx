import { Post } from '@/lib/wordpress';

interface RelatedPostsAboveNavProps {
    posts: Post[];
}

export function RelatedPostsAboveNav({ posts }: RelatedPostsAboveNavProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="my-12 pt-8 border-t border-border">
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-6">
                Related Posts
            </h2>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <ol className="space-y-3">
                    {posts.map((post, index) => (
                        <li key={post.id} className="flex gap-3 items-baseline">
                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                {index + 1}
                            </span>
                            <a 
                                href={`/${post.slug}/`}
                                className="group flex-1"
                            >
                                <h3 className="text-base font-serif font-semibold text-card-foreground group-hover:text-primary transition-colors leading-relaxed">
                                    {post.title}
                                </h3>
                            </a>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
