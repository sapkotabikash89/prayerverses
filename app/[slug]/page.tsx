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
import { getReadingTime, cn } from '@/lib/utils';
import { rewriteVerseLinks } from '@/lib/link-utils';

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

    const formattedDate = post.date ? format(new Date(post.date), 'MMMM dd, yyyy') : '';
    const featuredImage = post.featuredImage?.node;
    const rawContent = post.content ? rewriteVerseLinks(linkifyBibleVerses(post.content)) : '';

    // Process TOC
    const { updatedContent: contentWithIds, headings } = processContentForTOC(rawContent);

    // Splicing TOC before first H2 is tricky with dangerouslySetInnerHTML
    // Instead, we can split the content or just render TOC above content if we want it simple
    // But user asked "above the first h2 tag".
    const firstH2Index = contentWithIds.indexOf('<h2');
    const contentBeforeH2 = firstH2Index !== -1 ? contentWithIds.substring(0, firstH2Index) : contentWithIds;
    const contentAfterH2 = firstH2Index !== -1 ? contentWithIds.substring(firstH2Index) : '';

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
        <article className="mx-auto max-w-4xl px-4 py-8 lg:px-8 lg:py-10 post-content">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Breadcrumb
                items={[
                    {
                        label: post.categories?.nodes?.[0]?.name || 'Categories',
                        href: post.categories?.nodes?.[0] ? `/category/${post.categories.nodes[0].slug}/` : '/categories/'
                    },
                    { label: post.title, href: `/${slug}/` },
                ]}
            />

            <header className="mb-12">
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


            <div className="prose prose-lg prose-serif max-w-none text-muted-foreground leading-relaxed content-area">
                <div dangerouslySetInnerHTML={{ __html: contentBeforeH2 }} />
                {headings.length > 0 && <TableOfContents headings={headings} />}
                <div dangerouslySetInnerHTML={{ __html: contentAfterH2 }} />
            </div>


            <div className="mt-16">
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
