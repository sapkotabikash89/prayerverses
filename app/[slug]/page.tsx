import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getRelatedPosts, getRandomPostFromCategory } from '@/lib/wordpress';
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
import { ReadNext } from '@/components/read-next';
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

    const primaryCategory = post.categories?.nodes?.[0];
    const relatedPosts = primaryCategory
        ? await getRelatedPosts(primaryCategory.slug, post.id, 6)
        : [];
    
    // Get one random post for Read Next (different from related posts)
    const randomReadNext = primaryCategory && relatedPosts.length > 0
        ? await getRandomPostFromCategory(primaryCategory.slug, post.id)
        : null;
    
    // Make sure Read Next is different from Related Posts
    const finalReadNext = randomReadNext && !relatedPosts.some(rp => rp.id === randomReadNext.id)
        ? randomReadNext
        : null;

    const formattedDate = post.date ? format(new Date(post.date), 'MMMM dd, yyyy') : '';
    const featuredImage = post.featuredImage?.node;
    const rawContent = post.content ? rewriteVerseLinks(linkifyBibleVerses(post.content)) : '';

    // Process TOC
    const { updatedContent: contentWithIds, headings } = processContentForTOC(rawContent);

    // Insert Read Next after ALL images if we have a Read Next post
    let processedContent = contentWithIds;
    if (finalReadNext) {
        const readNextHTML = `
            <div class="read-next-container">
                <div class="my-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border-l-4 border-primary">
                    <p class="text-xs font-bold text-primary uppercase tracking-widest mb-2">Read Next</p>
                    <a href="/${finalReadNext.slug}/" class="group block">
                        <h3 class="text-sm font-serif font-semibold text-card-foreground group-hover:text-primary transition-colors leading-snug">${finalReadNext.title}</h3>
                    </a>
                </div>
            </div>
        `;
        
        // Find ALL images and insert Read Next after each one
        let result = processedContent;
        let match;
        const imgRegex = /<img[^>]*>/gi;
        const positions = [];
        
        // Collect all image positions
        while ((match = imgRegex.exec(result)) !== null) {
            const insertPosition = match.index + match[0].length;
            
            // Check for wrapper end after image
            const afterImage = result.substring(insertPosition);
            const wrapperEndMatch = afterImage.match(/^\s*(<\/figure>|<\/div>|<br[^>]*>\s*)/i);
            
            if (wrapperEndMatch) {
                positions.push({
                    position: insertPosition + wrapperEndMatch[0].length,
                    wrapperLength: wrapperEndMatch[0].length
                });
            } else {
                positions.push({
                    position: insertPosition,
                    wrapperLength: 0
                });
            }
        }
        
        // Insert Read Next after each image (in reverse order to maintain positions)
        positions.reverse().forEach((pos, idx) => {
            // Only insert after the first image, or add variation for subsequent ones
            if (idx === 0 || idx % 2 === 0) { // Insert after every other image to avoid repetition
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
            "name": post.author?.node?.name || "PrayerVerses Team"
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
        <article className="mx-auto max-w-4xl px-4 py-8 lg:px-8 lg:py-10 post-article">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PostBodyCleanup />
            <Breadcrumb
                items={[
                    {
                        label: post.categories?.nodes?.[0]?.name || 'Categories',
                        href: post.categories?.nodes?.[0] ? `/category/${post.categories.nodes[0].slug}/` : '/categories/'
                    },
                    { label: post.title, href: `/${slug}/` },
                ]}
            />

            <header className="mb-12 post-header">
                <h1 className="text-3xl font-serif font-bold text-card-foreground mb-6 lg:text-5xl leading-tight">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-muted-foreground mb-8">
                    <span>by</span>
                    <span className="font-bold text-[#1e3a8a]">
                        {post.author?.node?.name || 'PrayerVerses Team'}
                    </span>
                    <span className="text-muted-foreground/30 px-1">/</span>
                    <span>{formattedDate}</span>
                    <span className="text-muted-foreground/30 px-1">/</span>
                    {primaryCategory && (
                        <>
                            <a
                                href={`/category/${primaryCategory.slug}/`}
                                className="text-[#1e3a8a] font-bold hover:underline"
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
                {headings.length > 0 && <TableOfContents headings={headings} />}
                <div dangerouslySetInnerHTML={{ __html: contentAfterH2 }} />
            </div>


            <div className="mt-16">
                {/* Related Posts Above Navigation */}
                <RelatedPostsAboveNav posts={relatedPosts.slice(0, 5)} />
                
                <PostNavigation
                    previous={post.previous}
                    next={post.next}
                />
                <SocialShare />
                <HelpfulPoll />
                <RelatedPosts
                    posts={relatedPosts}
                    categorySlug={primaryCategory?.slug}
                />
            </div>
        </article>
    );
}
