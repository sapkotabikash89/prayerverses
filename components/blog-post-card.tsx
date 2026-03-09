import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Post } from '@/lib/wordpress';
import { rewriteVerseLinks } from '@/lib/link-utils';
import { linkifyBibleVerses } from '@/lib/bible-links';

interface BlogPostCardProps {
    post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
    const formattedDate = post.date ? format(new Date(post.date), 'MMMM dd, yyyy') : '';
    const featuredImage = post.featuredImage?.node;

    return (
        <Link
            href={`/${post.slug}/`}
            className="group flex flex-col overflow-hidden rounded-none border border-border bg-card transition-all hover:border-primary/30 hover:shadow-md"
        >
            {featuredImage ? (
                <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                        src={featuredImage.sourceUrl}
                        alt={featuredImage.altText || post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            ) : (
                <div className="aspect-video w-full bg-secondary/30 flex items-center justify-center">
                    <span className="text-muted-foreground text-xs uppercase tracking-widest font-semibold">
                        No Image
                    </span>
                </div>
            )}

            <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                    {post.categories?.nodes?.[0]?.name && (
                        <span className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-wider">
                            {post.categories.nodes[0].name}
                        </span>
                    )}
                    {post.categories?.nodes?.[0]?.name && post.author?.node?.name && (
                        <span className="text-[10px] text-muted-foreground">/</span>
                    )}
                    {post.author?.node?.name && (
                        <span className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-wider">
                            {post.author.node.name}
                        </span>
                    )}
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider ml-auto">
                        {formattedDate}
                    </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                </h3>

                {post.excerpt && (
                    <div
                        className="text-sm text-muted-foreground line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: rewriteVerseLinks(linkifyBibleVerses(post.excerpt)) }}
                    />
                )}

                <div className="mt-auto pt-4 flex items-center text-xs font-semibold text-primary">
                    Read More &rarr;
                </div>
            </div>
        </Link>
    );
}
