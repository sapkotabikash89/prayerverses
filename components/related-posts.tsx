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
                More Biblical Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => {
                    const featuredImage = post.featuredImage?.node;
                    return (
                        <a
                            key={post.id}
                            href={`/${post.slug}/`}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-xl hover:-translate-y-1"
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
                                <h3>
                                    {post.title}
                                </h3>
                                <div className="mt-4 flex items-center text-primary font-bold text-xs uppercase tracking-wider">
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
                        className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Explore More from this Category
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            )}
        </section>
    );
}
