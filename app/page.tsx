import { HomeHero } from "@/components/home/home-hero"
import { QuickAccessGrid } from "@/components/home/quick-access-grid"
import { LatestPostsSection } from "@/components/home/latest-posts-section"
import { TopicGrid } from "@/components/home/topic-grid"
import { BibleBooksSection } from "@/components/home/bible-books-section"
import { Button } from "@/components/ui/button"
import { getCategories } from "@/lib/wordpress"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PrayerVerses - Connect with God Through Verses and Prayers",
  description:
    "Discover daily Bible verses, read Scripture by topic, and deepen your faith with beautiful verse cards.",
  keywords: ["bible verses", "daily bible verse", "scripture of the day", "bible quotes", "spiritual inspiration", "bible study", "holy bible", "bible verses by topic", "christian faith"],
  openGraph: {
    title: "PrayerVerses - Connect with God Through Verses and Prayers",
    description:
      "Discover daily Bible verses, read Scripture by topic, and deepen your faith with beautiful verse cards.",
    type: "website",
  },
  alternates: { canonical: "https://prayerverses.com/" },
  robots: { index: true, follow: true },
}

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <article className="post-content">
      <div className="space-y-8">
        <HomeHero />
        <QuickAccessGrid />

        <section id="categories">
          <h2 className="sr-only">Browse by Topic</h2>
          <TopicGrid categories={categories} />
        </section>

        <LatestPostsSection />

        <section className="bg-primary/5 p-8 border border-primary/20 flex flex-col items-center text-center">
          <h2>Explore the Full Bible</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Access all 66 books of the Bible from Genesis to Revelation. Discover the wisdom and hope contained in every chapter.
          </p>
          <a href="/books-of-the-bible/">
            <Button size="lg" className="font-bold px-8">
              View All Bible Books
            </Button>
          </a>
        </section>
      </div>
    </article>
  )
}
