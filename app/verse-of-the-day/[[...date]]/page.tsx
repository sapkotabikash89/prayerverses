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
                    title: "Embracing a Beautiful Future",
                    p1: `This brilliant daily scripture delivers incredible hope for your single morning. When we closely study the bible verse of today morning from ${displayVerse.ref}, we find massive joy. Therefore, God actively pours perfect peace into your trusting soul. These beautiful promises found in today's bible quote absolutely guarantee spiritual abundance entirely. Consequently, they strongly remind us that the Holy Spirit provides endless strength. You can truly embrace this baily verse deeply within your eager heart.`,
                    p2: `Please take a very quiet moment to internalize this encouraging message specifically right now. Let God's secure joy totally overpower any worldly confusion strictly around you. Furthermore, you must deliberately dedicate precious time for deep reflection and intentional prayer today. A perfect verse of the day will undoubtedly direct your daily decisions successfully. Ultimately, today's bible text will gently comfort your previously weary spirit. Your entire mindset completely transforms through this powerful random verse of the day.`
                  };
                  return (
                    <>
                      <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(devotion.p1) }} />
                      <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(devotion.p2) }} />
                    </>
                  );
                })()}
              </div>
            </section>            {/* Devotional Thoughts Section */}
            <section>
              <h2>
                Devotional Thoughts
              </h2>
              <div className="prose prose-stone max-w-none dark:prose-invert text-muted-foreground space-y-6">
                {[
                  {
                    title: "Finding Absolute Refuge",
                    content: `God serves as our primary and most secure refuge during every single difficult season. This verse of today strongly encourages us to hide within His divine protection right now. Therefore, you can confidently release your heavy burdens into His massively capable hands today. Our daily morning verse guarantees that the Lord is always remarkably near to us. Furthermore, He remains a constant shield against any overwhelming earthly trouble specifically.`
                  },
                  {
                    title: "Accessing Divine Strength",
                    content: `We often feel completely exhausted by the various demands of our busy modern lives. However, the bible verse of today morning reminds us that God is our strength. This baily verse provides an incredible source of energy for your weary spirit specifically. Consequently, you do not need to rely on your own limited human understanding anymore. God actively empowers those who faithfully trust in His limitless and holy power forever.`
                  },
                  {
                    title: "A Very Present Help",
                    content: `The Lord never keeps His precious children waiting during their most critical times of need. Today's bible quote beautifully declares that He is a very present help indeed. Therefore, His divine assistance remains instantly available whenever you feel deeply worried or confused. The bible verse of the day offers a reliable foundation for your hoping heart. Additionally, your situation is never too complex for His perfect and total resolution completely.`
                  },
                  {
                    title: "Peace Amidst Trouble",
                    content: `Chaos may frequently surround our daily path through this extremely fallen and broken world. Yet, today's bible text boldly promises that we can remain truly peaceful inside Him. Consequently, your calm spirit will certainly reflect the incredible character of our loving Savior. This daily scripture successfully anchors your soul during the most intense and stressful storms. Moreover, God is intimately and carefully managing every single detail of your life.`
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
                Daily Prayers for Finding a Mighty Fortress
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-8 rounded-none bg-primary/5 border border-primary/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-primary">
                    <span className="text-2xl">🙏</span>
                    <h3>Mighty Fortress Prayer for Morning</h3>
                  </div>
                  <div className="text-muted-foreground leading-relaxed italic"
                    dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`&ldquo;Heavenly Father, I praise You for being my mighty fortress and my secure shelter. Please fill my heart with Your divine strength as I start this new day. This daily morning verse reminds me that You are always remarkably near. Therefore, I choose to walk boldly into whatever hopeful path You have created. Please protect my mind and my family from every single worry today. Amen.&rdquo;`) }}
                  />
                </div>
                <div className="p-8 rounded-none bg-secondary/30 border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-card-foreground">
                    <span className="text-2xl">🙏</span>
                    <h3>Constant Helper Prayer for Evening</h3>
                  </div>
                  <div className="text-muted-foreground leading-relaxed italic"
                    dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`&ldquo;Lord Jesus, I sincerely thank You for being my constant helper through this entire day. I reflect deeply on today's bible quote from ${displayVerse.ref} tonight. Please forgive me for any specific moments when I unfortunately doubted Your presence. However, Your love remains remarkably steadfast during every second of this quiet evening. Consequently, I rest securely in Your powerful arms and trust Your plan. Amen.&rdquo;`) }}
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
                    Extended Scripture Reading on Divine Protection
                  </h3>
                  <div className="text-muted-foreground leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`Today's verse from ${displayVerse.ref} uniquely connects with many other Bible passages about trust. These scriptures help you understand the full picture of divine protection for your life.`) }}
                  />
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>The incredibly potent bible verse of today morning provides extremely clear guidance. This daily morning verse firmly encourages us to reject crippling fear absolutely today. When we read Psalm 91:1-2, we discover a powerful secret for our souls. We must recognize the Lord as our ultimate fortress and my God always. Therefore, we can navigate confusing situations with His perfect and divine calm completely. God simply promises to orchestrate our safety when we totally submit to Him.</p>`) }} />
                    <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>Transitioning into the busy afternoon, we must urgently remember the words of Proverbs 18:10. The Lord strongly commands us to run into His name for real safety. This specific perspective definitely helps us to stay incredibly peaceful during stressful times. Your relationship with Jesus guarantees your spiritual gladness against every single obstacle. Consequently, you can permanently banish deep gloom from your mind completely right now. The Almighty God walks faithfully beside you wherever you hopefully go today.</p>`) }} />
                    <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>Finally, we should critically consider the comforting promise found in Isaiah 41:10. He actively desires to beautifully complete His magnificent work of strength within you. This bible quote of the day serves as an impenetrable spiritual booster always. Please hold tightly to the truth that the Lord provides abounding inner security. Furthermore, God works behind the scenes to continually bless your faithful personal prayers. You can happily end your busy day with a satisfied and hopeful heart.</p>`) }} />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-none bg-card border border-border shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2">
                      <span className="text-xl">💡</span>
                      Key Takeaway
                    </h3>
                    <div className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`Your soul finds true safety when you choose to surrender fully. This profound bible verse of today morning reminds us of His power. He provides inexhaustible divine strength for your heavy and weary heart always. When you realize that God grants your peace, anxiety finally rests today. Consequently, you can move forward with bold assurance and a hopeful spirit. You will experience profound spiritual joy every single beautiful day securely.`) }}
                    />
                  </div>
                  
                  <div className="p-6 rounded-none bg-card border border-border shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2">
                      <span className="text-xl">🎯</span>
                      Practical Application
                    </h3>
                    <div className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`Please honestly identify one specific problem regarding your current mood right now. Then, read ${displayVerse.ref} out loud and decide to trust Him completely. You should visualize yourself handing over this sadness to the Lord directly. Furthermore, write down this baily verse on a small note card immediately. Keep this card highly visible to remind yourself of His divine peace. This simple act will change your entire perspective on every single challenge.`) }}
                    />
                  </div>
                </div>
                
                <div className="p-6 rounded-none bg-secondary/30 border border-border">
                  <h3 className="mb-3 flex items-center gap-2">
                    <span className="text-xl">🤝</span>
                    Community Connection
                  </h3>
                  <div className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`We are intentionally meant to share God's incredible hope with others. Please share this random verse of the day with friends today. Encouraging another person with today's bible text will uplift your own spirit. Additionally, discussing related scripture together undoubtedly builds a much stronger community overall. Together, we can reflect the joyful character of Jesus Christ entirely. Your kindness will witness to the power of the holy gospel.`) }}
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
                        cat: "Mighty Fortress",
                        catSub: "",
                        ref: "Psalm 91:2",
                        text: "I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.",
                        thought: "God remains the most secure hiding place for your fragile soul always."
                      },
                      {
                        cat: "Strong Tower",
                        catSub: "",
                        ref: "Proverbs 18:10",
                        text: "The name of the LORD is a strong tower: the righteous runneth into it, and is safe.",
                        thought: "The righteous run into His holy name and find absolute safety today."
                      },
                      {
                        cat: "Divine Presence",
                        catSub: "",
                        ref: "Isaiah 41:10",
                        text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God.",
                        thought: "Do not be dismayed because God is always with you right now."
                      },
                      {
                        cat: "Firm Foundation",
                        catSub: "",
                        ref: "Psalm 18:2",
                        text: "The LORD is my rock, and my fortress, and my deliverer; my God, my strength.",
                        thought: "Jesus provides a firm foundation that never shakes during any intense storm."
                      },
                      {
                        cat: "Infinite Power",
                        catSub: "",
                        ref: "2 Samuel 22:33",
                        text: "God is my strength and power: and he maketh my way perfect.",
                        thought: "He makes my way perfect and gives me energy for everything specifically."
                      },
                      {
                        cat: "Assured Deliverance",
                        catSub: "",
                        ref: "Psalm 34:17",
                        text: "The righteous cry, and the LORD heareth, and delivereth them out of all their troubles.",
                        thought: "God delivers His people out of all their many difficult troubles faithfully."
                      },
                      {
                        cat: "Good Refuge",
                        catSub: "",
                        ref: "Nahum 1:7",
                        text: "The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.",
                        thought: "He knows and protects every single person that trusts in Him completely."
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
                <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>Today, the bible verse of today morning gives us a massive reason to profoundly feel secure. We serve a powerful God who perfectly understands our desperate inner spiritual needs. Jesus provide dynamic hope and delivers overwhelming strength consistently today. Furthermore, we are never abandoned when facing difficult challenges in this modern life. You can trust Him with your biggest worries and your smallest anxieties.</p>`) }} />
                <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>Please allow the truth of our daily scripture entirely transform your gloomy perspective permanently. God actively works directly inside your spirit specifically for your absolute true happiness. He will constantly supply magnificent peace and certainly never ever leave you alone. Take refuge in His love and experience His strength every single day securely. Your future remains bright and secure within His powerful and gracious hands.</p>`) }} />
                <div className="text-xl font-serif italic text-primary pt-4"
                  dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`&ldquo;When you choose to embrace His strength, you invite His peace into your heart.&rdquo;`) }}
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
