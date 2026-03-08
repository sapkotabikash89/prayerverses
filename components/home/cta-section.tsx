import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-16 lg:py-20 bg-primary">
      <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
        <h2 className="text-2xl font-serif font-bold text-primary-foreground lg:text-3xl text-balance">
          Start Your Spiritual Journey Today
        </h2>
        <p className="mt-3 text-primary-foreground/80 max-w-lg mx-auto leading-relaxed">
          Explore thousands of Bible verses, find comfort in prayers, and deepen
          your understanding of God&apos;s Word.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/verse-of-the-day/">
            <Button
              variant="secondary"
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              {"Today's Verse"}
            </Button>
          </Link>
          <Link href="/categories/">
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Browse Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
