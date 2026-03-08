import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about PrayerVerses and our mission to make Scripture accessible to everyone through daily verses, topical studies, and powerful prayers.",
  keywords: ["about prayerverses", "bible mission", "christian website", "daily bible ministry", "scripture accessibility", "spiritual goal", "about us bible", "christian resources", "faith mission", "bible platform"],
  openGraph: {
    title: "About Us",
    description:
      "Learn about PrayerVerses and our mission to make Scripture accessible to everyone through daily verses, topical studies, and powerful prayers.",
    type: "website",
  },
  alternates: { canonical: "https://prayerverses.com/about/" },
  robots: { index: true, follow: true },
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
      <Breadcrumb items={[{ label: "About", href: "/about/" }]} />
      <h1 className="text-3xl font-serif font-bold text-card-foreground mb-6 lg:text-4xl">
        About PrayerVerses
      </h1>

      <div className="flex flex-col gap-6">
        <p className="text-base leading-relaxed text-card-foreground">
          Prayer Verses is a place where people can find Bible verses, their meanings, and how they can apply those truths in daily life. Whether you&apos;re looking for a specific verse, searching by topic, or need a verse to match a keyword, we&apos;re here to help you find guidance and peace through Scripture.
        </p>
        <p className="text-base leading-relaxed text-card-foreground">
          We also share powerful prayers that are connected to Bible verses. These prayers cover everyday struggles and blessings—like strength, healing, peace, and gratitude. Each prayer is carefully written to help you feel more connected to God and supported in your spiritual journey.
        </p>
        <p className="text-base leading-relaxed text-card-foreground">
          Our goal is simple: to make it easier for you to connect with God&apos;s Word—anytime, anywhere. Whether you&apos;re reading alone, praying with family, or sharing verses with others, Prayer Verses is designed to be your trusted resource.
        </p>
        <p className="text-base leading-relaxed text-card-foreground">
          If you ever have questions, suggestions, or something you&apos;d like to see added to the site, feel free to reach out at <a href="mailto:info@prayerverses.com" className="text-primary hover:underline">info@prayerverses.com</a>.
        </p>
        <div className="mt-4">
          <p className="text-base font-serif font-bold text-card-foreground">Thank you for visiting,</p>
          <p className="text-base text-card-foreground">The Prayer Verses Team</p>
          <p className="text-base text-primary">https://prayerverses.com</p>
        </div>
      </div>
    </div>
  )
}
