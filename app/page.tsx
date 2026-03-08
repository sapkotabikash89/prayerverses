import { HomeHero } from "@/components/home/home-hero"
import { QuickAccessGrid } from "@/components/home/quick-access-grid"
import { LatestPostsSection } from "@/components/home/latest-posts-section"
import { TopicGrid } from "@/components/home/topic-grid"
import { BibleBooksSection } from "@/components/home/bible-books-section"
import { getCategories } from "@/lib/wordpress"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PrayerVerses - Daily Bible Verses & Spiritual Inspiration",
  description:
    "Discover daily Bible verses, read Scripture by topic, and deepen your faith with beautiful verse cards.",
  keywords: ["bible verses", "daily bible verse", "scripture of the day", "bible quotes", "spiritual inspiration", "bible study", "holy bible", "bible verses by topic", "christian faith"],
  openGraph: {
    title: "PrayerVerses - Daily Bible Verses & Spiritual Inspiration",
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
    <div className="space-y-12">
      <HomeHero />
      <QuickAccessGrid />

      <section id="categories">
        <TopicGrid categories={categories} />
      </section>

      <LatestPostsSection />

      <section className="bg-secondary/20 rounded-3xl p-8 border border-border">
        <BibleBooksSection />
      </section>
    </div>
  )
}
