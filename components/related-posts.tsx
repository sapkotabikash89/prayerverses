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
        <section className="mt-20 pt-16 border-t border-border">
            <h2>
                You Might Have Missed
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => {
                    const featuredImage = post.featuredImage?.node;
                    return (
                        <a
                            key={post.id}
                            href={`/${post.slug}/`}
                            className="group flex flex-col overflow-hidden rounded-lg bg-secondary/30 transition-colors hover:bg-secondary/50"
                        >
                            <div className="relative aspect-video w-full overflow-hidden">
                                {featuredImage ? (
                                    <Image
                                        src={featuredImage.sourceUrl}
                                        alt={featuredImage.altText || post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                                        <span className="text-muted-foreground text-xs uppercase tracking-widest font-semibold text-balance px-4 text-center">
                                            {post.title}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="text-lg font-bold font-serif mb-2 text-card-foreground group-hover:text-primary transition-colors mt-0">
                                    {post.title}
                                </h3>
                                <div className="mt-auto pt-3 flex items-center text-primary font-bold text-xs uppercase tracking-wider">
                                    Read Article
                                    <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>

            {categorySlug && (
                <div className="flex justify-center">
                    <a
                        href={`/category/${categorySlug}/`}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md font-bold transition-colors"
                    >
                        Explore More from this Category
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            )}
        </section>
    );
}
