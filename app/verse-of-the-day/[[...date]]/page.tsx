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
  let dateStr = date?.[0] || todayStr
  let v = verses[dateStr]

  if (!v) {
    const sortedDates = Object.keys(verses).sort().reverse()
    if (sortedDates.length > 0) {
      dateStr = sortedDates[0]
      v = verses[dateStr]
    }
  }

  if (!v) {
    return { title: 'Verse of the Day' }
  }

  const stripSiteName = (t?: string) =>
    t?.replace(/\s*[|\-–]\s*(Prayer\s*Verses|PrayerVerses)\s*$/i, '').trim() ?? '';

  const rawTitle = `Bible Verse of the Day: Daily Scripture & Verse of Today - ${v.ref}`
  const title = stripSiteName(rawTitle)
  const description = `Start your morning with our bible verse of today morning and today's bible quote. Explore daily scripture, baily verse, and verse of the day for ${dateStr} - "${v.text}"`
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
      "baily verse",
      "bible verse of the day",
      "daily scripture",
      "bible quotes of the day",
      "random verse of the day",
      "today's bible text",
      "today's bible quote",
      "daily morning verse",
      "bible verse of today morning",
      "verse of today",
      "daily bible verse",
      "bible study",
      "christian devotional",
      "scripture morning",
      "daily inspiration",
      "spiritual nourishment",
      v.ref,
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
              Today's Bible Verse of the Day: Your Daily Scripture (KJV)
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
                Bible Quotes of the Day: Multiple Translations of {displayVerse.ref}
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
                Daily Morning Verse and Today's Bible Text
              </h2>
              <div className="prose prose-stone max-w-none dark:prose-invert text-muted-foreground space-y-6">
                {(() => {
                  const devotionals = devotionalsData as Record<string, { title?: string, p1: string, p2: string }>;
                  const devotion = devotionals[displayVerse.ref] || {
                    title: "Overcoming Fear with God's Presence",
                    p1: `Our daily scripture provides incredible courage for every single morning. When we examine the bible verse of today morning from ${displayVerse.ref}, we discover immense spiritual joy. Therefore, God's powerful presence acts as a reliable anchor for our soul. The comforting promises found in today's bible quote banish fear forever. Consequently, they firmly remind us that the Lord is always near. You can truly experience this baily verse deeply in your courageous spirit.`,
                    p2: `Take a quiet moment to internalize this powerful daily message now. Let God's steady reassurance speak louder than worldly anxiety around you. Furthermore, you must boldly dedicate time for deep reflection and intentional prayer. This verse of the day will surely strengthen your daily decisions. Ultimately, today's bible text will effectively uphold your weary heart. Your entire life completely transforms through this random verse of the day.`
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
                    title: "Banish Fear from Your Mind",
                    content: `Fear constantly attempts to paralyze our faith and steal our joy. This incredible daily scripture commands us to completely reject every anxiety. Therefore, we should purposefully choose faith over our natural human worries. Psalm 34:4 promises that God delivers us from all our fears. Furthermore, His perfect love actively drives out all terrifying dread forever. You can confidently face any terrifying challenge because God protects you. As a result, your courageous spirit will display profound inner peace.`
                  },
                  {
                    title: "Embracing His Constant Presence",
                    content: `God clearly promises to remain intimately close to us every day. Today's bible text boldly assures us of His unfailing divine presence. Joshua 1:9 strongly commands us to remain brave because God is near. Consequently, you never truly walk alone through your darkest personal valleys. Our daily morning verse warmly invites us into His comforting embrace. Moreover, acknowledging His presence entirely transforms our deepest insecurities into boldness. God is intimately walking beside your every single step right now.`
                  },
                  {
                    title: "Receiving Divine Strength Daily",
                    content: `We often feel incredibly exhausted by the heavy demands of life. However, the Lord specializes in providing supernatural strength to weary souls. Philippians 4:13 declares that we can definitively accomplish everything through Christ. Therefore, your current human weakness is actually a canvas for His glory. This baily verse beautifully invites you to lean entirely on His might. Additionally, surrendering our intense limitations brightly allows His divine power to shine. You will firmly rise above every single crushing obstacle today.`
                  },
                  {
                    title: "Uphold by His Righteous Hand",
                    content: `The righteous right hand of God represents unmatched absolute sovereign power. This verse of today shines a magnificent light on His reliable protection. Psalm 63:8 beautifully illustrates how His right hand constantly upholds us. Consequently, you absolutely do not need to rely on your own fragile strength. The bible verse of the day securely provides endless encouragement for tomorrow. Furthermore, resting strictly in His strong grip produces a deeply resilient character. Let this glorious truth saturate your mind and steady your heart.`
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
                Daily Prayers for Faith and Hope
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-8 rounded-none bg-primary/5 border border-primary/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-primary">
                    <span className="text-2xl">🙏</span>
                    <h3>Dawn Prayer to Overcome Fear</h3>
                  </div>
                  <div className="text-muted-foreground leading-relaxed italic"
                    dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`&ldquo;Heavenly Father, I praise You for this deeply comforting verse of the day. Please completely remove every trace of fear as my morning begins. I desperately need Your strong presence to navigate the intimidating challenges of this day. Furthermore, I deliberately choose to place all my heavy anxieties upon You. This daily scripture clearly reminds me that You are my faithful protector. Therefore, I will walk boldly under Your strong right hand today. Amen.&rdquo;`) }}
                  />
                </div>
                <div className="p-8 rounded-none bg-secondary/30 border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-card-foreground">
                    <span className="text-2xl">🙏</span>
                    <h3>Dusk Prayer for Divine Upliftment</h3>
                  </div>
                  <div className="text-muted-foreground leading-relaxed italic"
                    dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`&ldquo;Lord Jesus, I sincerely thank You for sustaining me wonderfully throughout this day. I reflect deeply on today's bible quote from ${displayVerse.ref} tonight. Forgive me for the moments when my fragile courage unfortunately wavered under heavy pressure. However, Your righteous right hand is remarkably steadfast every single evening. Consequently, I gladly surrender every anxious thought into Your loving grip now. Please give me profoundly restful sleep and greatly renew my fainting spirit. Amen.&rdquo;`) }}
                  />
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
                <div className="p-6 rounded-none bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                  <h3 className="mb-4 flex items-center gap-2">
                    <span className="text-2xl">📖</span>
                    Extended Scripture Reading on Divine Courage
                  </h3>
                  <div className="text-muted-foreground leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`Today's verse from ${displayVerse.ref} uniquely connects with many other Bible passages about maintaining a completely fearless heart. These closely related scriptures actively help you understand the full biblical picture of spiritual bravery and sheer divine protection.`) }}
                  />
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>The incredibly potent bible verse of today morning provides extremely clear guidance concerning our daily fears. This daily morning verse firmly encourages us to reject crippling timidity absolutely without any personal reservations. When we deeply read Psalm 27:1, we finally discover the powerful secret to becoming truly fearless. We must quickly recognize the Lord as our brilliant light and our absolute ultimate salvation. Therefore, we can confidently navigate deeply terrifying situations with His divine and perfect clarity. God simply promises to completely eradicate the darkness when we totally submit to Him.</p>`) }} />
                    <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>Transitioning into the busy afternoon, we must urgently remember the powerful and encouraging words of Deuteronomy 31:6. The Lord strongly commands us to be exceptionally and outrageously courageous today. This specific perspective definitely helps us to stay incredibly calm during extremely chaotic and confusing times. Your intimate relationship with the loving Father guarantees your absolute spiritual safety against every vicious enemy. Consequently, you can permanently banish deep dread and heavy discouragement from your mind completely now. The Almighty God walks faithfully beside you wherever you bravely go in this temporary life.</p>`) }} />
                    <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>Finally, we must critically consider the deeply comforting promise found directly in 2 Timothy 1:7. The eternal God actively desires to fill you with a spirit of immense power right now. This bible quote of the day reliably serves as an impenetrable and uniquely powerful spiritual shield. Please firmly hold tightly to the truth that the Holy Spirit provides abounding inner strength forever. Furthermore, the Lord actively works behind the scenes to continually bless your exceedingly brave personal efforts. You can happily end your busy day with a deeply satisfied and surprisingly courageous heart.</p>`) }} />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-none bg-card border border-border shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2">
                      <span className="text-xl">💡</span>
                      Key Takeaway
                    </h3>
                    <div className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`Your fragile soul finds absolutely true safety when you choose to decisively conquer fear fully today. This profound bible verse of today morning wonderfully reminds us that He provides inexhaustible divine strength forever. When you boldly realize that the Almighty God securely holds you, your frantic heart finally rests. Consequently, you can confidently move forward with bold assurance and a deeply courageous spirit now. You will routinely experience profound relational joy and enduring personal bravery every single day.`) }}
                    />
                  </div>
                  
                  <div className="p-6 rounded-none bg-card border border-border shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2">
                      <span className="text-xl">🎯</span>
                      Practical Application
                    </h3>
                    <div className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`Please honestly identify one specific problem that is terribly making you feel very afraid right now. Then, loudly read ${displayVerse.ref} out loud and consciously decide to aggressively fight that fear completely today. You should intentionally visualize yourself handing over this terrifying situation to the powerful Lord directly. Furthermore, physically write down this baily verse on a small paper note card right now. Keep this particular card highly visible to frequently remind yourself of His constant and unyielding protection.`) }}
                    />
                  </div>
                </div>
                
                <div className="p-6 rounded-none bg-secondary/30 border border-border">
                  <h3 className="mb-3 flex items-center gap-2">
                    <span className="text-xl">🤝</span>
                    Community Connection
                  </h3>
                  <div className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`We are intentionally meant to share God's incredible boldness with the tremendously fearful people around us. Please bravely share this random verse of the day with a deeply anxious friend today. Constantly encouraging another panicking person with today's bible text will instantly uplift your own timid spirit. Additionally, frequently discussing related scripture together undoubtedly builds a much stronger and collectively braver local community overall. Together, we can confidently reflect the incredibly fearless and unconditionally victorious character of Jesus Christ.`) }}
                  />
                </div>

               </div>
             </div>
           </section>


            {/* Random Bible Scripture Grid */}
            <section>
              <h2>
                Random Verse of the Day and Daily Bible Quotes
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
                        cat: "Renewed Minds",
                        catSub: "",
                        ref: "Romans 12:2",
                        text: "And be not conformed to this world: but be ye transformed by the renewing of your mind.",
                        thought: "Allow God's truth to completely change how you think and act today."
                      },
                      {
                        cat: "Divine Healing",
                        catSub: "",
                        ref: "Jeremiah 17:14",
                        text: "Heal me, O LORD, and I shall be healed; save me, and I shall be saved: for thou art my praise.",
                        thought: "The Lord is the ultimate source of physical and spiritual restoration."
                      },
                      {
                        cat: "Joyful Hearts",
                        catSub: "",
                        ref: "Psalm 28:7",
                        text: "The LORD is my strength and my shield; my heart trusted in him, and I am helped.",
                        thought: "Your heart will rejoice when you trust in His unfailing protection absolutely."
                      },
                      {
                        cat: "Enduring Love",
                        catSub: "",
                        ref: "1 Corinthians 13:7",
                        text: "Love beareth all things, believeth all things, hopeth all things, endureth all things.",
                        thought: "True biblical love perseveres through every single trial and difficult challenge."
                      },
                      {
                        cat: "Unchanging Truth",
                        catSub: "",
                        ref: "Hebrews 13:8",
                        text: "Jesus Christ the same yesterday, and to day, and for ever.",
                        thought: "You can rely completely on Jesus because His character never changes ever."
                      },
                      {
                        cat: "Courageous Living",
                        catSub: "",
                        ref: "Psalm 27:1",
                        text: "The LORD is my light and my salvation; whom shall I fear?",
                        thought: "Fear loses its power when you recognize God as your bright light."
                      },
                      {
                        cat: "Abundant Giving",
                        catSub: "",
                        ref: "Luke 6:38",
                        text: "Give, and it shall be given unto you; good measure, pressed down, and shaken together.",
                        thought: "A generous heart always receives abundant blessings from the Heavenly Father."
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
                Final Thought on Today's Bible Text
              </h2>
              <div className="max-w-2xl mx-auto space-y-6 text-muted-foreground leading-relaxed px-6">
                <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>Today, the bible verse of today morning gives us a massive reason to profoundly rejoice. We reliably serve a courageous God who perfectly understands our deepest insecurities. He lovingly takes our trembling hand and skillfully guides every single step forever. Therefore, we are never truly defenseless when facing intimidating challenges in this extremely difficult life.</p>`) }} />
                <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>You can certainly trust Him with your biggest terrors and your absolutely smallest worries today. Please intentionally let the deep truth of our daily scripture permanently transform your life. Furthermore, God actively extends His righteous right hand for your absolute and ultimate protection. He will constantly strengthen your soul and never ever let you stumble or fall.</p>`) }} />
                <div className="text-xl font-serif italic text-primary pt-4"
                  dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`&ldquo;When you boldly choose to reject all fear completely, you successfully invite His divine strength into your brave heart.&rdquo;`) }}
                />
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
