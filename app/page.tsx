import { HomeHero } from "@/components/home/home-hero"
import { QuickAccessGrid } from "@/components/home/quick-access-grid"
import { LatestPostsSection } from "@/components/home/latest-posts-section"
import { TopicGrid } from "@/components/home/topic-grid"
import { BibleBooksSection } from "@/components/home/bible-books-section"
import { Button } from "@/components/ui/button"
import { getCategories } from "@/lib/wordpress"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PrayerVerses - Bible Verse of the Day, Daily Scripture & Prayers",
  description:
    "Explore our bible verse of today morning, today's bible quote, and baily verse. Connect with God through daily scripture of the day and powerful prayers.",
  keywords: ["bible verse of the day", "daily scripture", "bible quotes of the day", "today's bible quote", "bible verse of today morning", "baily verse", "verse of today", "spiritual inspiration", "bible study", "christian faith"],
  openGraph: {
    title: "PrayerVerses - Bible Verse of the Day, Daily Scripture & Prayers",
    description:
      "Explore our bible verse of today morning, today's bible quote, and baily verse. Connect with God through daily scripture of the day.",
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

        <section className="bg-secondary/30 p-8 rounded-2xl flex flex-col items-center text-center my-12">
          <h2 className="text-3xl font-bold font-serif mt-0 mb-4 text-card-foreground">Explore the Full Bible</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-lg">
            Access all 66 books of the Bible from Genesis to Revelation. Discover the wisdom and hope contained in every chapter.
          </p>
          <a href="/books-of-the-bible/">
            <Button size="lg" className="font-bold px-8 rounded-full">
              View All Bible Books
            </Button>
          </a>
        </section>
      </div>
    </article>
  )
}
