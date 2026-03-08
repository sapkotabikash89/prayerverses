import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search Bible Verses",
  description:
    "Search the entire Bible for specific verses, topics, or themes. Find the spiritual encouragement you need with our advanced Bible search tool.",
  keywords: ["bible search", "search bible verses", "find scripture", "bible topic search", "scripture finder", "holy bible online", "advanced bible search", "christian resources", "bible study tool", "spiritual search"],
  openGraph: {
    title: "Search Bible Verses",
    description:
      "Search the entire Bible for specific verses, topics, or themes. Find the spiritual encouragement you need with our advanced Bible search tool.",
    type: "website",
  },
  alternates: { canonical: "https://prayerverses.com/search/" },
  robots: { index: true, follow: true },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
