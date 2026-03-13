import { Post } from '@/lib/wordpress';

interface ReadNextProps {
    post: Post;
}

export function ReadNext({ post }: ReadNextProps) {
    if (!post) return null;

    return (
        <div className="my-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border-l-4 border-primary">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                Read Next
            </p>
            <a 
                href={`/${post.slug}/`}
                className="group block"
            >
                <h3 className="text-sm font-serif font-semibold text-card-foreground group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                </h3>
            </a>
        </div>
    );
}
