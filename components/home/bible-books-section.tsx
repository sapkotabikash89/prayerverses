import { bibleBooks } from "@/data/bible"

export function BibleBooksSection() {
  const ot = bibleBooks.filter((b) => b.testament === "OT")
  const nt = bibleBooks.filter((b) => b.testament === "NT")

  return (
    <section className="py-10 lg:py-20 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <h2>
            Explore the Books of the Bible
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Read through all 66 books of the Bible, from Genesis to Revelation.
          </p>
        </div>

        <div className="mb-12">
          <h3>
            Old Testament ({ot.length} books)
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {ot.map((book) => (
              <a
                key={book.slug}
                href={`/bible/${book.slug}/`}
                className="rounded-xl border-0 bg-secondary/30 px-4 py-3 text-center text-sm font-medium text-card-foreground hover:bg-secondary/60 transition-colors flex items-center justify-center min-h-[50px]"
              >
                {book.name}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3>
            New Testament ({nt.length} books)
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {nt.map((book) => (
              <a
                key={book.slug}
                href={`/bible/${book.slug}/`}
                className="rounded-xl border-0 bg-secondary/30 px-4 py-3 text-center text-sm font-medium text-card-foreground hover:bg-secondary/60 transition-colors flex items-center justify-center min-h-[50px]"
              >
                {book.name}
              </a>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/books-of-the-bible/"
            className="text-sm font-medium text-primary"
          >
            Explore all books
          </a>
        </div>
      </div>
    </section>
  )
}
