import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { getVersesForReference, getChapterVerses } from "@/lib/bible-text"
import { referenceToFirstVerseId } from "@/data/bible"
import versesData from "@/data/verses.json"
import devotionalsData from "@/data/devotionals.json"
import bibleTranslations from "@/data/bible-translations.json"
import { VerseOfTheDayClient } from "@/components/verse-of-the-day-client"
import { VerseDateSelector } from "@/components/verse-date-selector"
import { Breadcrumb } from "@/components/breadcrumb"
import { linkifyBibleVerses } from "@/lib/bible-links"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const verses = versesData as Record<string, { text: string; ref: string }>

function getNepalDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

export function generateStaticParams() {
  const dates = Object.keys(verses);
  return [
    { date: undefined }, // for the base route
    ...dates.map(date => ({ date: [date] }))
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date?: string[] }>
}): Promise<Metadata> {
  const { date } = await params
  const todayStr = getNepalDate()
  const dateStr = date?.[0] || todayStr
  const v = verses[dateStr]

  const title = `Bible Verse of the Day - ${v.ref}`
  const description = `Daily Bible verse for ${dateStr}: "${v.text}"`
  const isToday = dateStr === todayStr

  return {
    title,
    description,
    robots: {
      index: isToday,
      follow: true,
    },
    keywords: [
      "verse of the day",
      "daily bible verse",
      `bible verse for ${dateStr}`,
      "morning bible verse",
      "scripture of the day",
      v.ref,
      "daily devotion",
      "bible quotes",
      "christian inspiration",
      "spiritual nourishment",
    ],
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: "/daily-bible-verse.webp" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/daily-bible-verse.webp"],
    },
    alternates: {
      canonical: `https://prayerverses.com/verse-of-the-day/${isToday ? "" : `${dateStr}/`}`,
    },
  }
}

export default async function VerseOfTheDayPage({
  params,
}: {
  params: Promise<{ date?: string[] }>
}) {
  const { date } = await params
  const todayStr = getNepalDate()
  let dateStr = date?.[0] || todayStr
  let v = verses[dateStr]

  if (!v) {
    // If today's verse is missing, show the latest available one
    const sortedDates = Object.keys(verses).sort().reverse()
    if (sortedDates.length > 0) {
      dateStr = sortedDates[0]
      v = verses[dateStr]
    }
  }

  const isToday = dateStr === todayStr

  if (!v) notFound()

  // Get real verse data from /data/books
  const realVerses = await getVersesForReference(v.ref)
  const displayVerse = realVerses && realVerses.length > 0
    ? { text: realVerses.map(rv => rv.text).join(" "), ref: v.ref }
    : v

  // Get translations for today's verse from data file
 const getTranslations = (ref: string) => {
   // Check if we have translations in verses.json first
   const verseData = v as any
   if (verseData.translations) {
     return verseData.translations
   }
   
   // Otherwise, use the bible-translations.json lookup
   const translations = bibleTranslations[ref as keyof typeof bibleTranslations]
   if (translations) {
     return translations
   }
   
   // Fallback to KJV text for all versions if no translation found
   return {
     ESV: displayVerse.text,
     NIV: displayVerse.text,
     NLT: displayVerse.text,
     WEB: displayVerse.text,
     NKJV: displayVerse.text,
   }
 }

  // Get in-context verses (surrounding verses in the same chapter)
  const verseId = referenceToFirstVerseId(v.ref)
  let contextVerses: any[] = []
  if (verseId) {
    const parts = verseId.split("-")
    const bookSlug = parts.slice(0, -2).join("-")
    const chapter = parseInt(parts[parts.length - 2], 10)
    const verseNum = parseInt(parts[parts.length - 1], 10)

    const allChapterVerses = await getChapterVerses(bookSlug, chapter)
    if (allChapterVerses) {
      const index = allChapterVerses.findIndex(cv => cv.verse === verseNum)
      if (index !== -1) {
        // Take 2 before and 2 after if possible
        const start = Math.max(0, index - 2)
        const end = Math.min(allChapterVerses.length, index + 3)
        contextVerses = allChapterVerses.slice(start, end)
      }
    }
  }

  // Get this week's verses
  const allDates = Object.keys(verses).sort()
  const todayIdx = allDates.indexOf(dateStr)
  const last7Days = allDates.slice(Math.max(0, todayIdx - 6), todayIdx + 1).reverse()
  const thisWeeksVerses = last7Days.map(d => ({
    date: d,
    ...verses[d]
  }))

  const formattedDate = new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const prevDate = todayIdx > 0 ? allDates[todayIdx - 1] : null
  const nextDate = todayIdx < allDates.length - 1 ? allDates[todayIdx + 1] : null

  const faqs = [
    {
      question: `What is the Bible verse of the day, and why is it important?`,
      answer: `The Bible verse of the day is a hand-selected passage. Therefore, it inspires and encourages your heart today. For example, ${displayVerse.ref} offers a spiritual boost for your morning. It provides clarity and peace for your soul. Furthermore, this daily scripture helps you navigate life with confidence.`
    },
    {
      question: `How can the Bible quote of the day help me grow spiritually?`,
      answer: `Daily verses keep you rooted in God's Word. Consequently, you stay aligned with His promises. These scriptures fuel your devotion and deepen your relationship with Jesus. Also, each short passage delivers spiritual nourishment. It reminds you to trust and live faithfully every single day.`
    },
    {
      question: `Can the Bible verse of the day strengthen my prayer life?`,
      answer: `Yes, you can enhance your prayers with daily scripture. For instance, using ${displayVerse.ref} as a focus adds intention to your time. It guides your heart with divine promises. Whether you seek healing or hope, these passages help you express your soul. Therefore, prayer feels more personal and spirit-led.`
    },
    {
      question: `How is the daily scripture useful in everyday life and relationships?`,
      answer: `Every daily Bible verse carries practical wisdom. It touches family, friendships, and work. For instance, today's verse might remind you to show grace. These quotes offer real-life application for everyone. God's Word is not just inspirational. It is deeply transformational.`
    },
    {
      question: `Can I share the daily Bible Passage with others?`,
      answer: `Absolutely, you should share these messages with others. In fact, sharing ${displayVerse.ref} spreads light and love. A single scripture quote might be exactly what a friend needs. Whether it is a short verse or a full passage, it brings hope. Therefore, you can encourage hearts beyond your own.`
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
        "text": faq.answer.replace(/<a[^>]*>|<\/a>/g, "") // Strip links for JSON-LD
      }
    }))
  }

  return (
    <article className="post-content">
      <div className="bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {/* Header Section */}
        <div className="bg-secondary/30 border-b border-border py-8 lg:py-10">
          <div className="text-center px-4">
            <div className="flex justify-start mb-8">
              <Breadcrumb items={[{ label: "Verse of the Day", href: "/verse-of-the-day/" }]} />
            </div>
            <h1>
              Today's Bible Verse of the Day (KJV)
            </h1>
            <p className="text-lg text-muted-foreground mb-8">{formattedDate}</p>

            <div className="mb-10 flex flex-col items-center gap-4">
              <VerseDateSelector currentDate={dateStr} allDates={allDates} />
            </div>

            <VerseOfTheDayClient verse={displayVerse} date={dateStr} />

            <div className="mt-8 max-w-3xl mx-auto">
            </div>
          </div>
        </div>

        <div className="py-8 px-4">
          <div className="flex flex-col gap-16">
            {/* Translations Section */}
            <section>
              <h2>
                Translations of Today's Verse - {displayVerse.ref}
              </h2>
              <div className="space-y-8">
                {["ESV", "NIV", "NLT", "WEB", "NKJV"].map((version, i) => {
                  const translations = getTranslations(displayVerse.ref)
                  const translationText = translations[version as keyof typeof translations] || displayVerse.text
                  return (
                    <div key={version} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-none bg-primary/10 text-primary font-bold text-sm">
                          {i + 1}
                        </span>
                        <p className="text-sm font-bold text-primary uppercase tracking-widest">{version}</p>
                      </div>
                      <p className="text-base text-card-foreground leading-relaxed pl-11">{translationText}</p>
                    </div>
                  )
                })}
                <p className="text-xs text-muted-foreground italic mt-6">
                  Each translated version is copyrighted by its respective company. All rights reserved.
                </p>
              </div>
            </section>


            {/* In-Context Section */}
            {contextVerses.length > 0 && (
              <section>
                <h2>
                  Today's Bible Verse ({displayVerse.ref}) In-Context
                </h2>
                <div className="space-y-4 bg-card border border-border rounded-none p-6 lg:p-8">
                  {contextVerses.map((cv) => (
                    <div key={cv.verse} className={`flex gap-3 ${cv.reference === displayVerse.ref ? "bg-primary/5 rounded-none p-3 ring-1 ring-primary/20" : ""}`}>
                      <span className="text-xs font-bold text-primary mt-1 w-6">{cv.verse}</span>
                      <p className={`text-base leading-relaxed ${cv.reference === displayVerse.ref ? "text-card-foreground font-medium" : "text-muted-foreground"}`}>
                        {cv.text}
                        {cv.reference === displayVerse.ref && (
                          <span className="ml-2 inline-flex items-center rounded-none bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">Today's Verse</span>
                        )}
                      </p>
                    </div>
                  ))}
                  <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Showing {contextVerses.length} verses from the same chapter.</p>
                    <a href={`/bible/${verseId?.split("-").slice(0, -2).join("-")}/${verseId?.split("-")[verseId?.split("-").length - 2]}/`} className="text-sm font-bold text-primary flex items-center gap-1">
                      Read Full Chapter <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </section>
            )}

            {/* Daily Morning Scripture Section */}
            <section>
              <h2>
                Daily Morning Scripture of the Day
              </h2>
              <div className="prose prose-stone max-w-none dark:prose-invert text-muted-foreground space-y-6">
                {(() => {
                  const devotionals = devotionalsData as Record<string, { title?: string, p1: string, p2: string }>;
                  const devotion = devotionals[displayVerse.ref] || {
                    title: "Strength in the Word",
                    p1: `Every piece of Scripture carries life-giving power. As we reflect on today's verse from ${displayVerse.ref}, we are reminded that God's truth is an anchor for our soul. The promises found in His Word remain true despite the changing circumstances of our lives.`,
                    p2: `Take a moment today to internalize this truth. Let God's voice be louder than the noise of the world. Through prayer and reflection, allow this scripture to guide your decisions, comfort your heart, and empower your day.`
                  };
                  return (
                    <>
                      <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(devotion.p1) }} />
                      <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(devotion.p2) }} />
                    </>
                  );
                })()}
              </div>
            </section>

            {/* Devotional Thoughts Section */}
            <section>
              <h2>
                Devotional Thoughts
              </h2>
              <div className="prose prose-stone max-w-none dark:prose-invert text-muted-foreground space-y-6">
                {[
                  {
                    title: "Understanding God's Character",
                    content: `Every verse reveals something about who God is. When you read ${displayVerse.ref}, you're not just reading ancient words—you're discovering the heart of an unchanging God. His character remains constant across all generations, which means the same God who spoke in biblical times still speaks today.`
                  },
                  {
                    title: "Applying Scripture to Modern Life",
                    content: `The Bible isn't a museum piece to admire but bread to eat. Take one phrase from today's verse and carry it with you throughout your day. Repeat it during your commute, before meetings, or when facing decisions. Let it move from your head to your heart and into your actions.`
                  },
                  {
                    title: "The Power of Daily Meditation",
                    content: `Meditation is simply thinking deeply about God's truth. Unlike worldly meditation that empties the mind, biblical meditation fills it with Scripture. As you ponder today's verse, ask: What does this teach me about God? About myself? How should I respond? The Holy Spirit uses these moments to transform you from within.`
                  },
                  {
                    title: "Building Spiritual Discipline",
                    content: `Consistency matters more than intensity in spiritual growth. Reading one verse daily with sincerity builds stronger faith than occasional marathon sessions. Start small: read, reflect, respond in prayer. Over time, these daily encounters compound into profound spiritual maturity and deeper intimacy with Christ.`
                  }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3>{item.title}</h3>
                    <div dangerouslySetInnerHTML={{
                      __html: linkifyBibleVerses(item.content)
                    }} />
                  </div>
                ))}
              </div>
            </section>

            {/* Prayers of the Day Section */}
            <section>
              <h2>
                Prayers of the Day
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-8 rounded-none bg-primary/5 border border-primary/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-primary">
                    <span className="text-2xl">🙏</span>
                    <h3>Morning Prayer for Commitment</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;Lord, I commit this day and all its tasks into Your hands. Help me to labor not for my own glory, but for Yours. Give me a spirit of excellence and a heart of service. I roll my plans onto You, trusting that You will establish my steps and lead me toward Your perfect purpose. Amen.&rdquo;
                  </p>
                </div>
                <div className="p-8 rounded-none bg-secondary/30 border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-card-foreground">
                    <span className="text-2xl">🙏</span>
                    <h3>Evening Prayer for Trust</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;Thank You, Father, for Your guidance through this day. I lay down my work and my worries at Your feet. Forgive me where I relied on my own strength. Tonight, I rest in the assurance that You are already working in the details of tomorrow. Establish my heart in Your peace as I sleep. In Jesus' name, Amen.&rdquo;
                  </p>
                </div>
              </div>
            </section>

            {/* Daily Devotional Reading Section */}
           <section>
             <h2>
               Daily Devotional Reading
             </h2>
             <div className="space-y-6">
               <div className="p-6 rounded-none bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                 <h3 className="mb-4 flex items-center gap-2">
                   <span className="text-2xl">📖</span>
                   Extended Scripture Reading
                 </h3>
                 <p className="text-muted-foreground leading-relaxed mb-4">
                   Expand your understanding by reading the full chapter containing today's verse. Here are additional passages that complement {displayVerse.ref}:
                 </p>
                 <ul className="space-y-2 text-muted-foreground">
                   <li className="flex items-start gap-2">
                     <span className="text-primary mt-1">•</span>
                     <span><strong>Psalm 27:1-6</strong> - A psalm of trust in God's protection and guidance</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <span className="text-primary mt-1">•</span>
                     <span><strong>Isaiah 43:1-7</strong> - God's promise to be with us through every trial</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <span className="text-primary mt-1">•</span>
                     <span><strong>Romans 8:28-39</strong> - The depth of God's love and faithfulness to His children</span>
                   </li>
                 </ul>
               </div>
               
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="p-6 rounded-none bg-card border border-border shadow-sm">
                   <h3 className="mb-3 flex items-center gap-2">
                     <span className="text-xl">💡</span>
                     Key Takeaway
                   </h3>
                   <p className="text-muted-foreground leading-relaxed">
                     God's Word is not just information—it's transformation. As you meditate on {displayVerse.ref}, allow the Holy Spirit to renew your mind and reshape your heart. Small daily doses of Scripture, consistently applied, produce lasting spiritual growth.
                   </p>
                 </div>
                 
                 <div className="p-6 rounded-none bg-card border border-border shadow-sm">
                   <h3 className="mb-3 flex items-center gap-2">
                     <span className="text-xl">🎯</span>
                     Practical Application
                   </h3>
                   <p className="text-muted-foreground leading-relaxed">
                     Write today's verse on a card or set it as your phone wallpaper. Reference it throughout the day, especially during challenging moments. Let Scripture become your immediate source of truth, comfort, and direction in real-time situations.
                   </p>
                 </div>
               </div>
               
               <div className="p-6 rounded-none bg-secondary/30 border border-border">
                 <h3 className="mb-3 flex items-center gap-2">
                   <span className="text-xl">🤝</span>
                   Community Connection
                 </h3>
                 <p className="text-muted-foreground leading-relaxed">
                   Share today's verse with someone who might need encouragement. Text it to a friend, post it on social media, or mention it in conversation. God often uses His children to be the voice that speaks truth into each other's lives. Your obedience might be exactly what someone else needs to hear today.
                 </p>
               </div>
             </div>
           </section>


            {/* Random Bible Scripture Grid */}
            <section>
              <h2>
                Random Bible Scripture of the Day
              </h2>
              <div className="rounded-none border border-border overflow-hidden bg-card shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="w-[200px] font-bold text-card-foreground">Category</TableHead>
                      <TableHead className="font-bold text-card-foreground">Scripture & Short Thought</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        cat: "Daily Bible Verse for Morning",
                        ref: "Psalm 118:24",
                        text: "This is the day that the LORD has made; let us rejoice and be glad in it.",
                        thought: "Every day is a gift from God. Start your morning with a heart full of joy and gratitude."
                      },
                      {
                        cat: "Scripture for Strength and Courage",
                        ref: "Isaiah 41:10",
                        text: "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.",
                        thought: "When you feel weak or afraid, remember that the Almighty is personally holding you up."
                      },
                      {
                        cat: "Inspirational Daily Verse",
                        ref: "Colossians 3:23",
                        text: "Whatever you do, work heartily, as for the Lord and not for men.",
                        thought: "Your work has eternal value when done with a heart focused on serving the Savior."
                      },
                      {
                        cat: "Verse for Faith and Trust",
                        ref: "Proverbs 3:5-6",
                        text: "Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
                        thought: "Life's path becomes clear when we stop relying on our logic and start relying on God's wisdom."
                      },
                      {
                        cat: "Scripture on God's Love",
                        ref: "1 John 4:19",
                        text: "We love because he first loved us.",
                        thought: "Our ability to show grace and kindness flows directly from the immense love God has shown us."
                      },
                      {
                        cat: "Daily Wisdom from Proverbs",
                        catSub: "(Success)",
                        ref: "Proverbs 16:3",
                        text: "Commit your work to the LORD, and your plans will be established.",
                        thought: "True success is found in surrendering our efforts to God and trusting His direction."
                      },
                      {
                        cat: "Promise for Today",
                        ref: "Jeremiah 29:11",
                        text: "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
                        thought: "No matter how confusing today feels, God's ultimate plan for your life is full of hope."
                      }
                    ].map((row, i) => (
                      <TableRow key={i} className="hover:bg-transparent">
                        <TableCell className="font-bold text-primary align-top pt-4">
                          {row.cat}
                          {row.catSub && <span className="block text-[10px] text-muted-foreground uppercase tracking-widest">{row.catSub}</span>}
                        </TableCell>
                        <TableCell className="space-y-2 py-4">
                          <div className="text-card-foreground font-medium"
                            dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`${row.ref}: &ldquo;${row.text}&rdquo;`) }}
                          />
                          <div className="text-sm text-muted-foreground leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(row.thought) }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>

            {/* Final Thought Section */}
            <section className="text-center py-8 bg-secondary/20 rounded-none border border-border">
              <h2>
                Final Thought
              </h2>
              <div className="max-w-2xl mx-auto space-y-6 text-muted-foreground leading-relaxed px-6">
                <p>
                  Today's Bible verse is a reminder that we don't have to carry the weight of our future alone. When we commit our works to the Lord, we are making Him the CEO of our lives. He takes our humble efforts and weaves them into a masterpiece of His grace.
                </p>
                <p className="text-xl font-serif italic text-primary pt-4">
                  &ldquo;Success is not just achieving a goal; it is walking in the perfect alignment of God's will. Commit your day to Him, and watch Him establish your paths.&rdquo;
                </p>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mt-16">
              <h2>
                FAQs About the Daily Bible Verses
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
                        <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(faq.answer) }} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  )
}
