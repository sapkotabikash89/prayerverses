import Image from 'next/image';
import { Post } from '@/lib/wordpress';
import { ArrowRight } from 'lucide-react';

interface RelatedPostsProps {
    posts: Post[];
    categorySlug?: string;
}

export function RelatedPosts({ posts, categorySlug }: RelatedPostsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="mt-16 pt-16 border-t border-border">
            <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8">
                Related Posts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {posts.map((post) => {
                    const featuredImage = post.featuredImage?.node;
                    return (
                        <a
                            key={post.id}
                            href={`/${post.slug}/`}
                            className="group flex flex-col overflow-hidden rounded-none border border-border bg-card transition-all hover:border-primary/30 hover:shadow-md"
                        >
                            <div className="relative aspect-video w-full overflow-hidden">
                                {featuredImage ? (
                                    <Image
                                        src={featuredImage.sourceUrl}
                                        alt={featuredImage.altText || post.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                                        <span className="text-muted-foreground text-xs uppercase tracking-widest font-semibold text-balance px-4 text-center">
                                            {post.title}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="text-base font-serif font-bold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                    {post.title}
                                </h3>
                            </div>
                        </a>
                    );
                })}
            </div>

            {categorySlug && (
                <div className="flex justify-center">
                    <a
                        href={`/category/${categorySlug}/`}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-none font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                        More Posts
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            )}
        </section>
    );
}
