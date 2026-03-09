import type { Metadata } from "next"
import Link from "next/link"
import { getCategories } from "@/lib/wordpress"
import { Breadcrumb } from "@/components/breadcrumb"
import { TopicIcon } from "@/components/topic-icon"

export const metadata: Metadata = {
    title: "Bible Categories & Spiritial Topics",
    description:
        "Browse through all categories and topics from our spiritual blog. Discover insights, prayers, and biblical wisdom organized for your growth.",
    alternates: { canonical: "https://prayerverses.com/categories/" },
    robots: { index: true, follow: true },
}

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
            <Breadcrumb items={[{ label: "Categories", href: "/categories/" }]} />
            <h1 className="text-3xl font-serif font-bold text-card-foreground mb-2 lg:text-4xl">
                Spiritual Categories
            </h1>
            <p className="text-muted-foreground mb-10 max-w-2xl">
                Explore our curated content organized by category. Find guidance,
                inspiration, and biblical truth for every area of your spiritual life.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((topic) => (
                    <Link
                        key={topic.slug}
                        href={`/category/${topic.slug}/`}
                        className="group rounded-none border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
                    >
                        <div className="flex items-start gap-4">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <TopicIcon name="BookOpen" className="h-5 w-5" />
                            </span>
                            <div>
                                <h2 className="text-base font-semibold text-card-foreground mb-1">
                                    {topic.name}
                                </h2>
                                {topic.description && (
                                    <div
                                        className="text-sm text-muted-foreground leading-relaxed line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: topic.description }}
                                    />
                                )}
                                <p className="mt-2 text-xs text-primary font-medium">
                                    View Posts &rarr;
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
