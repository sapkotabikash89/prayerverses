import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { getVersesForReference, getChapterVerses } from "@/lib/bible-text"
import { referenceToFirstVerseId } from "@/data/bible"
import versesData from "@/data/verses.json"
import { VerseOfTheDayClient } from "@/components/verse-of-the-day-client"
import { VerseDateSelector } from "@/components/verse-date-selector"
import { Breadcrumb } from "@/components/breadcrumb"
import { AdsenseInArticleAd } from "@/components/adsense-in-article-ad"
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date?: string[] }>
}): Promise<Metadata> {
  const { date } = await params
  const dateStr = date?.[0] || new Date().toISOString().split("T")[0]
  const v = verses[dateStr]

  const title = `Bible Verse of the Day - ${v.ref}`
  const description = `Daily Bible verse for ${dateStr}: "${v.text}"`
  const todayStr = new Date().toISOString().split("T")[0]
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
  const todayStr = new Date().toISOString().split("T")[0]
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
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Header Section */}
      <div className="bg-secondary/30 border-b border-border py-12 lg:py-16">
        <div className="text-center">
          <div className="flex justify-start mb-8">
            <Breadcrumb items={[{ label: "Verse of the Day", href: "/verse-of-the-day/" }]} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-card-foreground mb-2 lg:text-4xl">
            Today's Bible Verse of the Day (KJV)
          </h1>
          <p className="text-lg text-muted-foreground mb-8">{formattedDate}</p>

          <div className="mb-10 flex flex-col items-center gap-4">
            <VerseDateSelector currentDate={dateStr} allDates={allDates} />
          </div>

          <VerseOfTheDayClient verse={displayVerse} date={dateStr} />
        </div>
      </div>

      <div className="py-8">
        <div className="flex flex-col gap-16">
          {/* Translations Section */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-card-foreground mb-6 border-b border-border pb-4">
              Translations of Today's Verse - {displayVerse.ref}
            </h2>
            <div className="space-y-6">
              {["ESV", "NIV", "NLT", "WEB", "NKJV"].map((version, i) => {
                const translations = (v as any).translations || {}
                const translationText = translations[version] || displayVerse.text
                return (
                  <div key={version} className="flex gap-4 p-4 rounded-xl border border-border bg-card/50">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{version}</p>
                      <p className="text-base text-card-foreground leading-relaxed">{translationText}</p>
                    </div>
                  </div>
                )
              })}
              <p className="text-xs text-muted-foreground italic mt-4">
                Each translated version is copyrighted by its respective company.
              </p>
            </div>
          </section>

          <AdsenseInArticleAd />

          {/* In-Context Section */}
          {contextVerses.length > 0 && (
            <section>
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-6 border-b border-border pb-4">
                Today's Bible Verse ({displayVerse.ref}) In-Context
              </h2>
              <div className="space-y-4 bg-card border border-border rounded-2xl p-6 lg:p-8">
                {contextVerses.map((cv) => (
                  <div key={cv.verse} className={`flex gap-3 ${cv.reference === displayVerse.ref ? "bg-primary/5 rounded-lg p-3 ring-1 ring-primary/20" : ""}`}>
                    <span className="text-xs font-bold text-primary mt-1 w-6">{cv.verse}</span>
                    <p className={`text-base leading-relaxed ${cv.reference === displayVerse.ref ? "text-card-foreground font-medium" : "text-muted-foreground"}`}>
                      {cv.text}
                      {cv.reference === displayVerse.ref && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">Today's Verse</span>
                      )}
                    </p>
                  </div>
                ))}
                <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Showing {contextVerses.length} verses from the same chapter.</p>
                  <Link href={`/bible/${verseId?.split("-").slice(0, -2).join("-")}/${verseId?.split("-")[verseId?.split("-").length - 2]}/`} className="text-sm font-bold text-primary flex items-center gap-1">
                    Read Full Chapter <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Daily Morning Scripture Section */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-card-foreground mb-6 border-b border-border pb-4">
              Daily Morning Scripture of the Day
            </h2>
            <div className="prose prose-stone max-w-none dark:prose-invert text-muted-foreground space-y-6">
              {displayVerse.ref === "Nahum 1:7" ? (
                <>
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    The morning brings a fresh start, and today's scripture from Nahum 1:7 is a powerful reminder of God's unchanging nature. In a world full of noise and uncertainty, the prophet Nahum declares a simple yet profound truth: "The Lord is good." This goodness isn't based on our circumstances, but on His eternal character. Furthermore, He is a "stronghold in the day of trouble."
                  `)
                  }} />
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    As you step into your day, take comfort in knowing that God is your primary refuge. Whether you face minor stress or significant trials, He offers a fortified place of safety for your soul. Most importantly, the verse reminds us that "He knows those who trust in him." You are not just a number; you are personally known and deeply loved by your Creator.
                  `)
                  }} />
                </>
              ) : isToday ? (
                <>
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    Every morning brings new hope and fresh opportunities. Therefore, starting your day with God's Word changes your perspective. Today, we focus on a powerful promise from ${displayVerse.ref}. This verse reminds us that God actively cares for our every requirement. Furthermore, it reassures us that His resources never run dry.
                  `)
                  }} />
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    When you face early challenges, remember this divine truth. God provides specifically for your physical and spiritual needs. Consequently, you can walk into your day with bold confidence. This morning scripture offers strength to those feeling overwhelmed. Trust in His riches and witness His faithfulness.
                  `)
                  }} />
                </>
              ) : (
                <>
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    Every day brings new challenges and fresh opportunities. Starting the morning with a Bible verse of the day set the tone. It is more than a habit. It is a way of connecting with God and finding direction. Also, it allows Scripture to shape your heart before the day begins.
                  `)
                  }} />
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    Think about how a single verse speaks differently in each season. A passage like <span className="text-primary font-medium">&ldquo;${displayVerse.text}&rdquo; (${displayVerse.ref})</span> brings comfort during hardship. It fuels courage when you face a new challenge. Most importantly, it provides the exact peace your soul needs today.
                  `)
                  }} />
                </>
              )}
            </div>
          </section>

          {/* Devotional Thoughts Section */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-card-foreground mb-6 border-b border-border pb-4">
              Devotional Thoughts
            </h2>
            <div className="prose prose-stone max-w-none dark:prose-invert text-muted-foreground space-y-6">
              {displayVerse.ref === "Nahum 1:7" ? (
                <>
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    Trusting God is an active choice, especially when we find ourselves in a "day of trouble." Nahum's message was originally written to people facing overwhelming odds, yet it remains just as relevant for us. Faith involves running to the Stronghold when the storms of life begin to howl. It's about letting His goodness be the anchor for your heart.
                  `)
                  }} />
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    In addition, consider the intimacy of being "known" by God. This isn't just about data; it's about a protective relationship. When you trust in Him, He takes personal responsibility for your care. Therefore, do not spend your energy on constant worry. Instead, focus your heart on the One who sees your faith and provides the exact peace your soul needs.
                  `)
                  }} />
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    Try to let this verse guide your focus throughout the afternoon. When anxiety whispers, answer back with the truth: "The Lord is good." When you meditate on this scripture, it becomes a quiet melody that keeps you steady. Consequently, you can live with a sense of security that the world cannot provide or take away.
                  `)
                  }} />
                </>
              ) : isToday ? (
                <>
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    Faith involves trusting God even when resources seem low. For instance, ${displayVerse.ref} promises that He meets every single lack. This scripture reminds us of His limitless riches and His desire to provide for His children. Similarly, we must rely on Christ for our daily strength.
                  `)
                  }} />
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    In addition, we should notice the deep promises in this passage. It covers your emotional stability and your spiritual growth. Therefore, do not spend your energy on constant worry. Instead, focus your heart on the One who holds everything. God invites you to bring your burdens to Him directly.
                  `)
                  }} />
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    Try to let this verse guide your focus throughout the afternoon. Ask yourself what God is telling you through this promise. Maybe it is a nudge to trust more and worry less. When you meditate on Scripture, it becomes like a quiet melody. Consequently, this melody keeps you steady no matter what comes.
                  `)
                  }} />
                </>
              ) : (
                <>
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    Spending time with Scripture is not about a spiritual list. It is about listening. When you slow down, the words settle in your heart. You begin to notice how they gently reshape your thoughts and priorities.
                  `)
                  }} />
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    A verse about patience reminds you to pause before reacting. Also, a verse about forgiveness softens your heart. These small moments transform an ordinary day into something sacred. 
                  `)
                  }} />
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    Try to let the verse of the day guide your primary focus. Ask what God is trying to tell you through this. Maybe it is a nudge to trust more or extend grace. When you meditate on Scripture, it keeps you steady.
                  `)
                  }} />
                  <div dangerouslySetInnerHTML={{
                    __html: linkifyBibleVerses(`
                    Next, write down the verse and a few reflections if you journal. Repeat it in your thoughts if you are on the move. The goal is presence rather than perfection. God's Word is living and active for you today.
                  `)
                  }} />
                </>
              )}
            </div>
          </section>

          {/* Prayers of the Day Section */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 border-b border-border pb-4">
              Prayers of the Day
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 shadow-sm">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <span className="text-2xl">🙏</span>
                  <h3 className="font-serif font-bold text-xl">Morning Prayer</h3>
                </div>
                {displayVerse.ref === "Nahum 1:7" ? (
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;Heavenly Father, I thank You for Your goodness and for being my refuge. In this day of trouble, I run to You as my stronghold. Thank You for knowing me and for Your constant care. Help me to trust You more deeply as I walk through this day. In Jesus&rsquo; name, Amen.&rdquo;
                  </p>
                ) : isToday ? (
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;Heavenly Father, I thank You for Your amazing provision. Please help me trust Your timing today. I believe You will meet my every need according to Your riches. Let Your peace fill my heart as I walk in faith. In Jesus&rsquo; name, Amen.&rdquo;
                  </p>
                ) : (
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;Heavenly Father, thank You for a new day. Help me to open my heart to Your Word. Let the truth of Scripture guide my thoughts today. Fill me with wisdom and strength as I walk with You. Amen.&rdquo;
                  </p>
                )}
              </div>
              <div className="p-8 rounded-3xl bg-secondary/30 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-4 text-card-foreground">
                  <span className="text-2xl">🙏</span>
                  <h3 className="font-serif font-bold text-xl">Evening Prayer</h3>
                </div>
                {displayVerse.ref === "Nahum 1:7" ? (
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;Lord Jesus, thank You for being my shelter today. I find rest in the knowledge that Your goodness surrounds me. As I sleep, I trust in Your protective presence. Thank You for knowing my heart and keeping me safe. Amen.&rdquo;
                  </p>
                ) : isToday ? (
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;Lord Jesus, thank You for watching over me today. I rest easy knowing You are my provider. Grant me peace as I sleep tonight. I trust in Your limitless grace for tomorrow. Amen.&rdquo;
                  </p>
                ) : (
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;Lord Jesus, I thank You for Your faithfulness this evening. Where I fell short, please forgive me. Let Your Word settle in my spirit tonight. Teach me to rest in Your presence. Amen.&rdquo;
                  </p>
                )}
              </div>
            </div>
          </section>

          <AdsenseInArticleAd />

          {/* Random Bible Scripture Grid */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 border-b border-border pb-4">
              Random Bible Scripture of the Day
            </h2>
            <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
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
                      cat: "Bible verse for today morning",
                      ref: "Psalm 143:8",
                      text: "Let me hear in the morning of your steadfast love, for in you I trust.",
                      thought: "This reminds us to begin the day listening for God's love and guidance."
                    },
                    {
                      cat: "Bible verse of the day about strength",
                      ref: "Isaiah 40:31",
                      text: "They who wait for the Lord shall renew their strength.",
                      thought: "We gain strength through patience and trust in God."
                    },
                    {
                      cat: "Inspirational verse of the day",
                      ref: "Philippians 4:13",
                      text: "I can do all things through him who strengthens me.",
                      thought: "It points us to the source of our power: Christ."
                    },
                    {
                      cat: "Verse of the day with reflection",
                      ref: "Romans 8:28",
                      text: "We know that in all things God works for the good of those who love him.",
                      thought: "Even hard things are woven by God for redemptive purposes."
                    },
                    {
                      cat: "Verse of the day about love",
                      ref: "1 John 4:19",
                      text: "We love because he first loved us.",
                      thought: "Our love stems from God’s initiative toward us."
                    },
                    {
                      cat: "Random Bible Scripture of the day",
                      catSub: "(Peace)",
                      ref: "Colossians 3:15",
                      text: "And let the peace of Christ rule in your hearts.",
                      thought: "We are reminded to let Christ’s peace guide us."
                    },
                    {
                      cat: "Geneva Bible Verse of the day",
                      ref: "Psalm 119:105",
                      text: "Thy word is a lantern unto my feet.",
                      thought: "God’s Word shows the way forward."
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
          <section className="text-center py-12 bg-secondary/20 rounded-3xl border border-border">
            <h2 className="text-2xl font-serif font-bold text-card-foreground mb-6">
              Final Thought
            </h2>
            <div className="max-w-2xl mx-auto space-y-6 text-muted-foreground leading-relaxed px-6">
              <p>
                The Bible verse of the day is an invitation from God. Each verse whispers a unique message to your soul. However, every one of them points to the same truth. God is present and faithful.
              </p>
              <p className="text-xl font-serif italic text-primary pt-4">
                &ldquo;When you make time for His Word, it lights your path. It strengthens your heart for every challenge ahead.&rdquo;
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 text-center">
              FAQs About the Daily Bible Verses
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
  )
}
