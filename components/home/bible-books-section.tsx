import Link from "next/link"
import { bibleBooks } from "@/data/bible"

export function BibleBooksSection() {
  const ot = bibleBooks.filter((b) => b.testament === "OT")
  const nt = bibleBooks.filter((b) => b.testament === "NT")

  return (
    <section className="py-16 lg:py-20 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-serif font-bold text-card-foreground lg:text-3xl text-balance">
            Books of the Bible
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Read through all 66 books of the Bible, from Genesis to Revelation.
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Old Testament ({ot.length} books)
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {ot.map((book) => (
              <Link
                key={book.slug}
                href={`/bible/${book.slug}/`}
                className="rounded-none border border-border bg-card px-4 py-3 text-center text-sm font-medium text-card-foreground hover:border-primary/30 hover:shadow-md transition-all flex items-center justify-center min-h-[50px]"
              >
                {book.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            New Testament ({nt.length} books)
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {nt.map((book) => (
              <Link
                key={book.slug}
                href={`/bible/${book.slug}/`}
                className="rounded-none border border-border bg-card px-4 py-3 text-center text-sm font-medium text-card-foreground hover:border-primary/30 hover:shadow-md transition-all flex items-center justify-center min-h-[50px]"
              >
                {book.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/books-of-the-bible/"
            className="text-sm font-medium text-primary"
          >
            Explore all books
          </Link>
        </div>
      </div>
    </section>
  )
}
