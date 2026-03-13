import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { getVersesForReference, getChapterVerses } from "@/lib/bible-text"
import { referenceToFirstVerseId } from "@/data/bible"
import versesData from "@/data/verses.json"
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

function getNYDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
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
  const todayStr = getNYDate()
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
  const todayStr = getNYDate()
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
            <h1 className="text-3xl font-serif font-bold text-card-foreground mb-2 lg:text-4xl">
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
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-6 border-b border-border pb-4">
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
                <h2 className="text-2xl font-serif font-bold text-card-foreground mb-6 border-b border-border pb-4">
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
                ) : displayVerse.ref === "Matthew 5:16" ? (
                   <>
                    <div dangerouslySetInnerHTML={{
                      __html: linkifyBibleVerses(`
                      Starting your day with Matthew 5:16 provides a clear mission for every disciple. Jesus commands: "Let your light so shine before men." This isn't just a suggestion; it is our primary identity as followers of Christ. Furthermore, this verse reminds us that our "good works" are meant to be visible, not for our own praise, but to point others toward God.
                    `)
                    }} />
                    <div dangerouslySetInnerHTML={{
                      __html: linkifyBibleVerses(`
                      As you begin your morning, consider how you can be a beacon of hope and kindness. Your light shine brightest when you respond with grace in difficult situations. Consequently, those around you will notice something different about your character. Most importantly, the end goal of your reflection is that they may "glorify your Father which is in heaven."
                    `)
                    }} />
                  </>
                ) : isToday ? (
                  <>
                    <div dangerouslySetInnerHTML={{
                      __html: linkifyBibleVerses(`
                      Morning is God's special gift of time to us. As you wake up, invite the Holy Spirit to lead your thoughts before anything else. Open your Bible and let His words be the first voice you hear. This simple practice transforms ordinary mornings into divine appointments.
                    `)
                    }} />
                    <div dangerouslySetInnerHTML={{
                      __html: linkifyBibleVerses(`
                      Consider starting with gratitude: thank God for breath in your lungs, for another sunrise, for His mercies that are new this morning. Gratitude shifts your focus from problems to Providence. It prepares your heart to receive what God wants to speak to you today.
                    `)
                    }} />
                  </>
                ) : (
                  <>
                    <div dangerouslySetInnerHTML={{
                      __html: linkifyBibleVerses(`
                      Mornings set the trajectory for your entire day. Before checking messages or news, spend time in prayer and Scripture reading. Let God's truth be the foundation that everything else builds upon. This discipline creates spiritual stability that lasts all day long.
                    `)
                    }} />
                    <div dangerouslySetInnerHTML={{
                      __html: linkifyBibleVerses(`
                      Think about Mary rising early to visit the tomb, or Jesus withdrawing before dawn to pray. The morning hours hold special significance for encountering God. Use this time to surrender your plans and listen for His direction. What seems like a small investment yields eternal returns.
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
                    <h3 className="text-lg font-serif font-bold text-card-foreground">{item.title}</h3>
                    <div dangerouslySetInnerHTML={{
                      __html: linkifyBibleVerses(item.content)
                    }} />
                  </div>
                ))}
              </div>
            </section>

            {/* Prayers of the Day Section */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 border-b border-border pb-4">
                Prayers of the Day
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-8 rounded-none bg-primary/5 border border-primary/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-primary">
                    <span className="text-2xl">🙏</span>
                    <h3 className="font-serif font-bold text-xl">Morning Prayer for Guidance</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;Gracious Heavenly Father, as I begin this day, I surrender my plans to You. Open my eyes to see Your wonders hidden in ordinary moments. Give me wisdom to discern Your voice amid the noise of life. Let today&apos;s verse take root in my heart and transform my thoughts, words, and actions. May everything I do bring honor to Your holy name. In Jesus&apos; mighty name, Amen.&rdquo;
                  </p>
                </div>
                <div className="p-8 rounded-none bg-secondary/30 border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-card-foreground">
                    <span className="text-2xl">🙏</span>
                    <h3 className="font-serif font-bold text-xl">Evening Prayer for Reflection</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;Dear Lord Jesus, I come before You tonight with a grateful heart. Thank You for walking beside me through every moment of this day. Forgive me where I fell short and help me grow from each experience. As I rest tonight, quiet my mind and fill my dreams with Your peace. Renew my strength for tomorrow&apos;s journey with You. Amen.&rdquo;
                  </p>
                </div>
              </div>
            </section>

            {/* Daily Devotional Reading Section */}
           <section>
             <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 border-b border-border pb-4">
               Daily Devotional Reading
             </h2>
             <div className="space-y-6">
               <div className="p-6 rounded-none bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                 <h3 className="font-serif font-bold text-xl text-card-foreground mb-4 flex items-center gap-2">
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
                   <h3 className="font-serif font-bold text-lg text-card-foreground mb-3 flex items-center gap-2">
                     <span className="text-xl">💡</span>
                     Key Takeaway
                   </h3>
                   <p className="text-muted-foreground leading-relaxed">
                     God's Word is not just information—it's transformation. As you meditate on {displayVerse.ref}, allow the Holy Spirit to renew your mind and reshape your heart. Small daily doses of Scripture, consistently applied, produce lasting spiritual growth.
                   </p>
                 </div>
                 
                 <div className="p-6 rounded-none bg-card border border-border shadow-sm">
                   <h3 className="font-serif font-bold text-lg text-card-foreground mb-3 flex items-center gap-2">
                     <span className="text-xl">🎯</span>
                     Practical Application
                   </h3>
                   <p className="text-muted-foreground leading-relaxed">
                     Write today's verse on a card or set it as your phone wallpaper. Reference it throughout the day, especially during challenging moments. Let Scripture become your immediate source of truth, comfort, and direction in real-time situations.
                   </p>
                 </div>
               </div>
               
               <div className="p-6 rounded-none bg-secondary/30 border border-border">
                 <h3 className="font-serif font-bold text-lg text-card-foreground mb-3 flex items-center gap-2">
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
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 border-b border-border pb-4">
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
                        ref: "Lamentations 3:22-23",
                        text: "The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.",
                        thought: "God's mercies are refreshed each morning, giving us new hope and strength for today."
                      },
                      {
                        cat: "Scripture for Strength and Courage",
                        ref: "Deuteronomy 31:6",
                        text: "Be strong and courageous. Do not fear or be in dread of them, for it is the LORD your God who goes with you. He will not leave you or forsake you.",
                        thought: "God's constant presence gives us courage to face any challenge with confidence."
                      },
                      {
                        cat: "Inspirational Daily Verse",
                        ref: "Psalm 46:1",
                        text: "God is our refuge and strength, a very present help in trouble.",
                        thought: "In times of need, God is not distant but immediately available as our fortress."
                      },
                      {
                        cat: "Verse for Faith and Trust",
                        ref: "Hebrews 11:1",
                        text: "Now faith is the assurance of things hoped for, the conviction of things not seen.",
                        thought: "Faith gives us certainty about God's promises even when we can't see the outcome."
                      },
                      {
                        cat: "Scripture on God's Love",
                        ref: "Romans 5:8",
                        text: "But God shows his love for us in that while we were still sinners, Christ died for us.",
                        thought: "God's love is unconditional and demonstrated through Christ's sacrifice."
                      },
                      {
                        cat: "Daily Wisdom from Proverbs",
                        catSub: "(Guidance)",
                        ref: "Proverbs 16:9",
                        text: "The heart of man plans his way, but the LORD establishes his steps.",
                        thought: "We make plans, but God directs our path according to His perfect will."
                      },
                      {
                        cat: "Promise for Today",
                        ref: "Matthew 11:28",
                        text: "Come to me, all who labor and are heavy laden, and I will give you rest.",
                        thought: "Jesus invites us to find true rest and peace in Him, no matter our burdens."
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
