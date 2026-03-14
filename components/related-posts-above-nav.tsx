import { Post } from '@/lib/wordpress';

interface RelatedPostsAboveNavProps {
    posts: Post[];
}

export function RelatedPostsAboveNav({ posts }: RelatedPostsAboveNavProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="my-12 pt-10 border-t border-border">
            <h2>
                You May Also Like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {posts.map((post, index) => (
                    <a 
                        key={post.id}
                        href={`/${post.slug}/`}
                        className="group flex items-center gap-4 bg-secondary/10 dark:bg-secondary/5 p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-all hover:shadow-sm"
                    >
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 text-primary text-sm font-bold rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {index + 1}
                        </span>
                        <h3>
                            {post.title}
                        </h3>
                    </a>
                ))}
            </div>
        </section>
    );
}
