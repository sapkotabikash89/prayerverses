import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { bibleBooks, getBookBySlug } from "@/data/bible"
import { notFound } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function generateStaticParams() {
  return bibleBooks.map((b) => ({ book: b.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ book: string }>
}): Promise<Metadata> {
  const { book } = await params
  const b = getBookBySlug(book)
  if (!b) return {}

  const title = `${b.name} - Read the Bible`
  const description = `Read the Book of ${b.name} online. Browse all ${b.chapters} chapters of ${b.name} from the ${b.testament === "OT" ? "Old" : "New"} Testament.`

  return {
    title,
    description,
    keywords: [
      b.name,
      `read ${b.name} online`,
      "bible book",
      b.testament === "OT" ? "old testament" : "new testament",
      "holy bible",
      "kjv bible",
      "scripture reading",
      `${b.name} chapters`,
      "bible study",
      "christianity",
    ],
    openGraph: {
      title,
      description,
      type: "article",
    },
    alternates: { canonical: `https://prayerverses.com/bible/${b.slug}/` },
    robots: { index: false, follow: true },
  }
}

export default async function BibleBookPage({
  params,
}: {
  params: Promise<{ book: string }>
}) {
  const { book } = await params
  const b = getBookBySlug(book)
  if (!b) notFound()

  const faqs = [
    {
      question: `What is the main message of the Book of ${b.name}?`,
      answer: `The Book of ${b.name} is a vital part of the ${b.testament === 'OT' ? 'Old' : 'New'} Testament, focusing on ${b.testament === 'OT' ? 'God\'s law and the history of Israel' : 'the life of Jesus and the teachings of the apostles'}. It contains ${b.chapters} chapters that guide believers in their spiritual journey.`
    },
    {
      question: `How many chapters are in ${b.name}?`,
      answer: `The Book of ${b.name} consists of exactly ${b.chapters} chapters. Each chapter offers unique insights into God's word and provides a structured way to study the themes of ${b.name.toLowerCase()}.`
    },
    {
      question: `Who is the author of the Book of ${b.name}?`,
      answer: `The authorship of ${b.name} is traditionally attributed to ${b.slug === 'genesis' || b.slug === 'exodus' || b.slug === 'leviticus' || b.slug === 'numbers' || b.slug === 'deuteronomy' ? 'Moses' : 'inspired biblical figures'}. This historical context is essential for a deeper understanding of the text.`
    },
    {
      question: `What are the most famous verses in ${b.name}?`,
      answer: `Famous verses in ${b.name} are found throughout its ${b.chapters} chapters, providing inspiration and comfort to millions. These scriptures are often quoted in sermons and used for daily devotionals.`
    },
    {
      question: `Why should I study the Book of ${b.name}?`,
      answer: `Studying ${b.name} is important for any Christian looking to understand the full scope of God's revelation. It provides the foundation for many ${b.testament === 'OT' ? 'Old' : 'New'} Testament promises and reveals God's consistent nature.`
    },
    {
      question: `How does ${b.name} fit into the Bible's overall story?`,
      answer: `${b.name} plays a crucial role in the Bible's narrative of ${b.testament === 'OT' ? 'creation and covenant' : 'salvation and the church'}. It connects with other books to show God's continuous plan for redeeming His people.`
    }
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  const chapters = Array.from({ length: b.chapters }, (_, i) => i + 1)

  return (
    <div className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Breadcrumb
        items={[
          { label: "Bible", href: "/books-of-the-bible/" },
          { label: b.name, href: `/bible/${b.slug}/` }
        ]}
      />
      <Link
        href="/read-bible/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        All Books
      </Link>

      <h1 className="text-3xl font-serif font-bold text-card-foreground mb-2 lg:text-4xl">
        {b.name}
      </h1>
      <p className="text-muted-foreground mb-8">
        {b.testament === "OT" ? "Old Testament" : "New Testament"} &middot;{" "}
        {b.chapters} {b.chapters === 1 ? "Chapter" : "Chapters"}
      </p>

      <section>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
          {chapters.map((ch) => (
            <Link
              key={ch}
              href={`/bible/${b.slug}/${ch}/`}
              className="flex items-center justify-center rounded-lg border border-border bg-card py-3 text-sm font-medium text-card-foreground hover:border-primary/30 hover:bg-secondary hover:shadow-sm transition-all"
            >
              {ch}
            </Link>
          ))}
        </div>
      </section>

      {/* Bible Study FAQ Section */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 text-center">
          Related Questions and Answers
        </h2>
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border rounded-2xl px-6 bg-card shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="text-left font-semibold text-card-foreground hover:text-primary transition-colors py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}
