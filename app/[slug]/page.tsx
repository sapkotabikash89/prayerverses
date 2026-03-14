import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getRelatedPosts } from '@/lib/wordpress';
import postSlugsData from '@/data/post-slugs.json';
import { format } from 'date-fns';
import { Breadcrumb } from '@/components/breadcrumb';
import Image from 'next/image';
import { linkifyBibleVerses } from '@/lib/bible-links';
import { PostNavigation } from '@/components/post-navigation';
import { SocialShare } from '@/components/social-share';
import { HelpfulPoll } from '@/components/helpful-poll';
import { BlogImageActions } from '@/components/blog-image-actions';
import { TableOfContents } from '@/components/table-of-contents';
import { processContentForTOC } from '@/lib/toc-utils';
import { RelatedPosts } from '@/components/related-posts';
import { RelatedPostsAboveNav } from '@/components/related-posts-above-nav';
import { getReadingTime, cn } from '@/lib/utils';
import { rewriteVerseLinks } from '@/lib/link-utils';
import { PostBodyCleanup } from '@/components/post-body-cleanup';

interface BlogPostPageProps {
   params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  //Use cached slugs data for static export
 return postSlugsData.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const { seo } = post;

    return {
        title: seo?.title || post.title,
        description: seo?.metaDesc || post.excerpt,
        alternates: {
            canonical: `https://prayerverses.com/${slug}/`,
        },
        openGraph: {
            title: seo?.opengraphTitle || seo?.title || post.title,
            description: seo?.opengraphDescription || seo?.metaDesc || post.excerpt,
            images: seo?.opengraphImage?.sourceUrl ? [{ url: seo.opengraphImage.sourceUrl }] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: seo?.twitterTitle || seo?.title || post.title,
            description: seo?.twitterDescription || seo?.metaDesc || post.excerpt,
            images: seo?.twitterImage?.sourceUrl ? [seo.twitterImage.sourceUrl] : [],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const categories = post.categories?.nodes || [];
    // Filter out broad/parent categories to find a more specific one for "Read Next"
    const broadCategories = ['bible-verses', 'blog', 'uncategorized', 'verses-by-topic', 'verses-by-category', 'topics', 'biblical-insights', 'spiritual-insights'];
    const primaryCategory = categories.find(cat => !broadCategories.includes(cat.slug)) || categories[0];
    
    const relatedPosts = primaryCategory
        ? await getRelatedPosts(primaryCategory.slug, post.id, 20) // Fetch more for Read Next injection
        : [];
    
    const formattedDate = post.date ? format(new Date(post.date), 'MMMM dd, yyyy') : '';
    const featuredImage = post.featuredImage?.node;
    const rawContent = post.content ? rewriteVerseLinks(linkifyBibleVerses(post.content)) : '';

    // Process TOC
    const { updatedContent: contentWithIds, headings } = processContentForTOC(rawContent);

    // Insert Read Next after ALL images if we have related posts
    let processedContent = contentWithIds;
    if (relatedPosts.length > 0) {
        let result = processedContent;
        let match;
        const imgRegex = /<img[^>]*>/gi;
        const positions = [];
        
        // Collect all image positions
        while ((match = imgRegex.exec(result)) !== null) {
            const insertPosition = match.index + match[0].length;
            
            // Check for wrapper end after image, safely skipping any immediate <figcaption>
            const afterImage = result.substring(insertPosition);
            const closeMatch = afterImage.match(/^\s*(?:<figcaption[^>]*>.*?<\/figcaption>\s*)?(?:<\/figure>|<\/div>|<br[^>]*>\s*)/is);
            
            if (closeMatch) {
                positions.push({
                    position: insertPosition + closeMatch[0].length,
                    wrapperLength: closeMatch[0].length
                });
            } else {
                positions.push({
                    position: insertPosition,
                    wrapperLength: 0
                });
            }
        }
        
        // Shuffle or pick unique posts for each image
        // We'll use the last related posts for Read Next to avoid duplicates with the bottom ones (which use relatedPosts.slice(0, 6))
        const readNextCandidates = [...relatedPosts].reverse();
        
        // Insert Read Next after each image (in reverse order to maintain positions)
        positions.reverse().forEach((pos, idx) => {
            const nextPost = readNextCandidates[idx % readNextCandidates.length];
            if (nextPost) {
                const readNextHTML = `
                    <div class="mt-6 mb-4 not-prose bg-secondary/50 px-5 py-4 rounded-xl shadow-sm border border-border/50">
                        <a href="/${nextPost.slug}/" class="text-lg sm:text-xl font-serif font-bold text-card-foreground hover:text-primary transition-colors no-underline block leading-tight">
                            <span class="text-primary font-bold tracking-wider uppercase text-xs sm:text-sm mr-2 font-sans inline-block mb-1">READ NEXT:</span> ${nextPost.title}
                        </a>
                    </div>
                `;
                const beforeInsert = result.substring(0, pos.position);
                const afterInsert = result.substring(pos.position);
                result = beforeInsert + readNextHTML + afterInsert;
            }
        });
        
        processedContent = result;
    }

    // Splice TOC before first H2
    const firstH2Index = processedContent.indexOf('<h2');
    const contentBeforeH2 = firstH2Index !== -1 ? processedContent.substring(0, firstH2Index) : processedContent;
    const contentAfterH2 = firstH2Index !== -1 ? processedContent.substring(firstH2Index) : '';

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.seo?.metaDesc || post.excerpt || post.title,
        "url": `https://prayerverses.com/${slug}/`,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": {
            "@type": "Person",
            "name": post.author?.node?.name || "PrayerVerses Staff"
        },
        "publisher": {
            "@type": "Organization",
            "name": "PrayerVerses",
            "logo": {
                "@type": "ImageObject",
                "url": "https://prayerverses.com/prayer-verses-logo.webp"
            }
        },
        ...(featuredImage?.sourceUrl ? {
            "image": {
                "@type": "ImageObject",
                "url": featuredImage.sourceUrl
            }
        } : {}),
        ...(primaryCategory ? {
            "articleSection": primaryCategory.name
        } : {}),
    }

    return (
        <article className="mx-auto max-w-3xl px-4 py-8 lg:px-6 lg:py-10 post-article">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PostBodyCleanup />
            <Breadcrumb
                items={[
                    {
                        label: primaryCategory?.name || 'Categories',
                        href: primaryCategory ? `/category/${primaryCategory.slug}/` : '/categories/'
                    },
                    { label: post.title, href: `/${slug}/` },
                ]}
            />

            <header className="mb-12 post-header">
                <h1>
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-muted-foreground mb-8">
                    <span>by</span>
                    <a href="/" className="font-bold text-primary hover:underline">
                        {post.author?.node?.name || 'PrayerVerses Staff'}
                    </a>
                    <span className="text-muted-foreground/30 px-1">/</span>
                    <span>{formattedDate}</span>
                    <span className="text-muted-foreground/30 px-1">/</span>
                    {primaryCategory && (
                        <>
                            <a
                                href={`/category/${primaryCategory.slug}/`}
                                className="text-primary font-bold hover:underline"
                            >
                                {primaryCategory.name}
                            </a>
                            <span className="text-muted-foreground/30 px-1">/</span>
                        </>
                    )}
                    <span>{getReadingTime(post.content || '')} min read</span>
                </div>
            </header>

            {featuredImage && (
                <>
                    <div className="w-full mb-6">
                        <Image
                            src={featuredImage.sourceUrl}
                            alt={featuredImage.altText || post.title}
                            width={featuredImage.mediaDetails?.width || 1200}
                            height={featuredImage.mediaDetails?.height || 675}
                            className="w-full h-auto rounded-none shadow-sm"
                            priority
                        />
                    </div>
                    <BlogImageActions slug={slug} />
                </>
            )}


            <div className="content-area article-body prose prose-lg prose-serif max-w-none text-muted-foreground leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: contentBeforeH2 }} />
                {headings.length > 0 && (
                    <>
                        {relatedPosts.length > 0 && (
                            <div className="my-8 not-prose bg-secondary/50 px-6 py-5 rounded-xl shadow-sm border border-border/50">
                                <a href={`/${relatedPosts[0].slug}/`} className="text-xl font-serif font-bold text-card-foreground hover:text-primary transition-colors no-underline block leading-tight">
                                    <span className="text-primary font-bold tracking-wider uppercase text-sm mr-2 font-sans inline-block mb-1">READ NEXT:</span> {relatedPosts[0].title}
                                </a>
                            </div>
                        )}
                        <TableOfContents headings={headings} />
                    </>
                )}
                <div dangerouslySetInnerHTML={{ __html: contentAfterH2 }} />
            </div>


            <div className="mt-16">
                {/* Related Posts Above Navigation */}
                <RelatedPostsAboveNav posts={relatedPosts.slice(0, 6)} />
                
                <PostNavigation
                    previous={post.previous}
                    next={post.next}
                />
                <SocialShare />
                <HelpfulPoll />
                <RelatedPosts
                    posts={relatedPosts.slice(0, 6)}
                    categorySlug={primaryCategory?.slug}
                />
            </div>
        </article>
    );
}
