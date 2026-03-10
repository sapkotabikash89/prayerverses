import type { Metadata } from "next"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { bibleBooks, getBookBySlug } from "@/data/bible"
import { notFound } from "next/navigation"
import { getChapterVerses } from "@/lib/bible-text"
import { Breadcrumb } from "@/components/breadcrumb"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function generateStaticParams() {
  const params: { book: string; chapter: string }[] = []
  for (const b of bibleBooks) {
    for (let i = 1; i <= b.chapters; i++) {
      params.push({ book: b.slug, chapter: String(i) })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>
}): Promise<Metadata> {
  const { book, chapter } = await params
  const b = getBookBySlug(book)
  if (!b) return {}

  const title = `${b.name === 'Psalms' ? 'Psalm' : b.name} Chapter ${chapter}`
  const description = `Read ${b.name} Chapter ${chapter} from the Holy Bible. Study Scripture verse by verse.`

  return {
    title,
    description,
    keywords: [
      `${b.name} ${chapter}`,
      `read ${b.name} chapter ${chapter}`,
      "bible chapter",
      "kjv bible",
      "holy scripture",
      "verse by verse",
      "bible study",
      b.name,
      "online bible",
      "christian devotional",
    ],
    openGraph: {
      title,
      description,
      type: "article",
    },
    alternates: {
      canonical: `https://prayerverses.com/bible/${b.slug}/${chapter}/`,
    },
    robots: { index: false, follow: true },
  }
}

export default async function BibleChapterPage({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>
}) {
  const { book, chapter } = await params
  const b = getBookBySlug(book)
  const ch = parseInt(chapter, 10)
  if (!b || isNaN(ch) || ch < 1 || ch > b.chapters) notFound()

  const verses = await getChapterVerses(b.slug, ch)
  if (!verses || verses.length === 0) notFound()

  const prevCh = ch > 1 ? ch - 1 : null
  const nextCh = ch < b.chapters ? ch + 1 : null

  let faqs = [
    {
     question: `What is the central theme of ${b.name === 'Psalms' ? 'Psalm' : b.name} ${ch}?`,
      answer: `The central theme of ${b.name === 'Psalms' ? 'Psalm' : b.name} ${ch} revolves around ${b.testament === 'OT' ? "God's instruction and the history of His people" : 'the teachings of Jesus and the growth of the early church'}. It contains key verses that illustrate ${b.name}'s overall message.`
    },
    {
     question: `How many verses are in ${b.name === 'Psalms' ? 'Psalm' : b.name} ${ch}?`,
      answer: `There are ${verses.length} verses in ${b.name === 'Psalms' ? 'Psalm' : b.name} ${ch}. Each verse contributes to the detailed narrative and spiritual lessons presented in this portion of the ${b.testament === 'OT' ? 'Old' : 'New'} Testament.`
    },
    {
     question: `Who wrote the book of ${b.name} and this chapter?`,
      answer: `The book of ${b.name} is traditionally attributed to ${b.slug === 'genesis' || b.slug === 'exodus' || b.slug === 'leviticus' || b.slug === 'numbers' || b.slug === 'deuteronomy' ? 'Moses' : 'divinely inspired authors'}. This historical context is essential for a deeper understanding of the text.`
    },
    {
     question: `How does ${b.name === 'Psalms' ? 'Psalm' : b.name} ${ch} apply to modern Christian life?`,
      answer: `This chapter applies to modern life by offering timeless wisdom on faith, obedience, and God's relationship with humanity. It encourages believers to apply these scriptural principles in their daily walk with Christ.`
    },
    {
     question: `What are the key verses in ${b.name} ${ch}?`,
      answer: `Key verses in this chapter include ${verses[0]?.reference} and others that highlight the ${b.name.toLowerCase()}'s core teachings. These verses are often used for meditation and deeper Bible study.`
    },
    {
     question: `Where can I find a summary of ${b.name === 'Psalms' ? 'Psalm' : b.name} ${ch}?`,
      answer: `A summary of ${b.name === 'Psalms' ? 'Psalm' : b.name} ${ch} can be found by reading through its ${verses.length} verses, which detail the events and instructions God provided for His people during this specific time in biblical history.`
    }
  ]

  // High quality Genesis 1 FAQs
  if (b.slug === 'genesis' && ch === 1) {
    faqs = [
      {
        question: "What is the central theme of Genesis Chapter 1?",
        answer: "Genesis 1 reveals the powerful origin of our entire universe. God creates everything from nothing through His divine spoken word. Consequently, the chapter establishes God as the supreme designer of all life. First, He forms the light and the heavens above us. Next, He shapes the dry land and the vast oceans. He then fills these spaces with diverse plants and living creatures. Finally, God creates human beings in His own holy image. This structure shows that our world has great purpose and order."
      },
      {
        question: "How many verses are in Genesis Chapter 1?",
        answer: "This foundational chapter contains 31 distinct and powerful verses. Each verse meticulously records a specific step in the creation process. For instance, the early verses focus on the formation of light. Later verses describe the appearance of animals and human life. The chapter concludes with God seeing that His creation is very good. Therefore, every single verse carries deep spiritual and historical weight. You can study these verses to see God's careful plan unfold."
      },
      {
        question: "Who wrote the book of Genesis and this chapter?",
        answer: "Most biblical scholars attribute the book of Genesis to the prophet Moses. He likely wrote these accounts under direct divine inspiration from God. Moses recorded the origins of the world to guide the people of Israel. Furthermore, this writing provided a clear identity for the chosen nation. The text uses simple yet profound language to explain complex beginnings. It remains a cornerstone of faith for millions around the globe today. Thus, the authorship reflects a unique partnership between God and man."
      },
      {
        question: "How does Genesis Chapter 1 apply to modern Christian life?",
        answer: "Genesis 1 teaches us that our lives have immense value and meaning. Since God created us, we belong to Him and reflect His glory. Modern believers find great comfort in knowing the world is not random. Instead, we see a universe designed with love and incredible precision. This truth encourages us to care for the environment and each other. We also learn to rest, following God's example on the seventh day. Faith begins with accepting God as the author of all existence."
      },
      {
        question: "What are the key verses in Genesis 1?",
        answer: "Genesis 1:1 stands as the most famous verse in this entire chapter. It declares that God created the heavens and the earth in the beginning. Another vital verse is Genesis 1:26 where God decides to make mankind. This verse highlights the special status of humans above all other creation. Furthermore, Genesis 1:31 shows God's total satisfaction with His completed work. These verses provide a strong foundation for understanding the rest of Scripture. They remind us of our Creator's power and His holy presence."
      },
      {
        question: "Where can I find a summary of Genesis Chapter 1?",
        answer: "You can summarize Genesis 1 as the six-day record of creation. On the first three days, God creates environments like light and land. During the next three days, He fills those spaces with life. He creates the sun, moon, birds, fish, and land animals. The climax of the chapter occurs with the creation of humanity. God gives people authority to rule over the earth and its creatures. In conclusion, the chapter portrays a perfect world coming from a perfect God."
      }
    ]
  }

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

  return (
    <article className="post-content">
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <Breadcrumb
          items={[
            { label: "Bible", href: "/books-of-the-bible/" },
            { label: b.name, href: `/bible/${b.slug}/` },
            { label: `${b.name === 'Psalms' ? 'Psalm' : b.name} ${ch}`, href: `/bible/${b.slug}/${ch}/` }
          ]}
        />
        <a
          href={`/bible/${b.slug}/`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          {b.name}
        </a>

        <h1 className="text-3xl font-serif font-bold text-card-foreground mb-8 lg:text-4xl">
          {b.name === 'Psalms' ? 'Psalm' : b.name} {ch}
        </h1>


        <div className="rounded-none border border-border bg-card p-6 lg:p-8">
          <div className="flex flex-col gap-4">
            {verses.map((v) => (
              <p
                key={v.verseId}
                id={`verse${v.verse}`}
                className="text-base leading-relaxed text-card-foreground scroll-mt-24"
              >
                <span className="text-xs font-bold text-primary mr-1.5 align-super">
                  {v.verse}
                </span>
                {v.text}
              </p>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          {prevCh ? (
            <a
              href={`/bible/${b.slug}/${prevCh}/`}
              className="inline-flex items-center gap-1 text-sm text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
              Chapter {prevCh}
            </a>
          ) : (
            <span />
          )}
          {nextCh ? (
            <a
              href={`/bible/${b.slug}/${nextCh}/`}
              className="inline-flex items-center gap-1 text-sm text-primary"
            >
              Chapter {nextCh}
              <ChevronRight className="h-4 w-4" />
            </a>
          ) : (
            <span />
          )}
        </div>


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
                  className="border border-border rounded-none px-6 bg-card shadow-sm overflow-hidden"
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
    </article>
  )
}
