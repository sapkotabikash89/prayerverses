import type { Metadata } from "next"
import Link from "next/link"
import { bibleBooks } from "@/data/bible"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Read the Bible",
  description:
    "Read through all 66 books of the Bible online. Access the Old and New Testaments organized for easy reading.",
  keywords: ["read bible online", "holy bible", "old testament", "new testament", "bible books", "scripture reading", "online bible", "kjv bible", "bible study", "christian scripture"],
  openGraph: {
    title: "Read the Bible",
    description:
      "Read through all 66 books of the Bible online. Access the Old and New Testaments organized for easy reading.",
    type: "website",
  },
  alternates: { canonical: "https://prayerverses.com/read-bible/" },
  robots: { index: true, follow: true },
}

export default function ReadBiblePage() {
  const ot = bibleBooks.filter((b) => b.testament === "OT")
  const nt = bibleBooks.filter((b) => b.testament === "NT")

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
      <Breadcrumb items={[{ label: "Bible", href: "/books-of-the-bible/" }]} />
      <h1 className="text-3xl font-serif font-bold text-card-foreground mb-2 lg:text-4xl">
        Read the Bible
      </h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Browse all 66 books of the Holy Bible. Select a book to begin reading
        chapter by chapter.
      </p>

      <div className="mb-12">
        <h2 className="text-lg font-serif font-semibold text-card-foreground mb-4">
          Old Testament
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {ot.map((book) => (
            <Link
              key={book.slug}
              href={`/bible/${book.slug}/`}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <span className="text-sm font-medium text-card-foreground">
                {book.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {book.chapters} ch
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-serif font-semibold text-card-foreground mb-4">
          New Testament
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {nt.map((book) => (
            <Link
              key={book.slug}
              href={`/bible/${book.slug}/`}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <span className="text-sm font-medium text-card-foreground">
                {book.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {book.chapters} ch
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
