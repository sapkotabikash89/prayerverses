import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getPostsByCategory, getCategories } from '@/lib/wordpress';
import { Breadcrumb } from '@/components/breadcrumb';
import { linkifyBibleVerses } from '@/lib/bible-links';
import { PostGrid } from '@/components/post-grid';
import { rewriteVerseLinks } from '@/lib/link-utils';

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const categories = await getCategories();
    return categories.map((category) => ({
        slug: category.slug,
    }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    const { seo } = category;

    return {
        title: seo?.title || category.name,
        description: seo?.metaDesc || category.description,
        alternates: {
            canonical: `https://prayerverses.com/category/${slug}/`,
        },
        openGraph: {
            title: seo?.opengraphTitle || seo?.title || category.name,
            description: seo?.opengraphDescription || seo?.metaDesc || category.description,
            images: seo?.opengraphImage?.sourceUrl ? [{ url: seo.opengraphImage.sourceUrl }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: seo?.twitterTitle || seo?.title || category.name,
            description: seo?.twitterDescription || seo?.metaDesc || category.description,
            images: seo?.twitterImage?.sourceUrl ? [seo.twitterImage.sourceUrl] : [],
        },
        robots: { index: false, follow: true },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const { nodes: posts, pageInfo } = await getPostsByCategory(slug, 21);
    const description = category.description ? rewriteVerseLinks(linkifyBibleVerses(category.description)) : '';

    return (
        <article className="post-content">
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
                <Breadcrumb
                    items={[
                        { label: 'Categories', href: '/categories/' },
                        { label: category.name, href: `/category/${slug}/` },
                    ]}
                />

                <div className="mb-12">
                    <h1>
                        {category.name}
                    </h1>
                    {description && (
                        <div
                            className="prose prose-lg text-lg text-muted-foreground max-w-3xl leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}
                </div>

                {posts.length > 0 ? (
                    <PostGrid
                        initialPosts={posts}
                        initialPageInfo={pageInfo}
                        categorySlug={slug}
                    />
                ) : (
                    <div className="text-center py-20 bg-secondary/20 rounded-none border border-dashed border-border">
                        <p className="text-muted-foreground">No posts found in this category.</p>
                    </div>
                )}
            </div>
        </article>
    );
}
