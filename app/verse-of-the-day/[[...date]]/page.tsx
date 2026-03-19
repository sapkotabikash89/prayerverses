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
                    title: "Strength in the Word",
                    p1: `Every piece of our daily scripture carries life-giving power. As we reflect on the bible verse of today morning from ${displayVerse.ref}, we are reminded that God's truth is an anchor for our soul. The promises found in today's bible quote remain true despite the changing circumstances of our lives.`,
                    p2: `Take a moment with this baily verse to internalize this truth. Let God's voice be louder than the noise of the world. Through prayer and reflection, allow this verse of today to guide your decisions, comfort your heart, and empower your day.`
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
                    title: "Unending Mercies for Challenges",
                    content: `God's mercies are the primary reason we can stand strong against every daily trial. Fear cannot survive when you recognize that His love is deeper than any ocean. Today's bible text emphasizes that we are never fully overwhelmed by our current problems. Consequently, you can face the unknown with a heart full of steady peace. Transitions from darkness to light happen because the Lord is working for your good.`
                  },
                  {
                    title: "Fresh Grace Each Morning",
                    content: `The bible verse of today morning declares that God's compassions are new every single day. This means your past mistakes do not define the opportunities waiting for you right now. You can start this morning with a clean slate and a bright vision. Trust that the Holy Spirit provides exactly what you need for this specific hour. God tailors His help to match every unique situation you encounter today.`
                  },
                  {
                    title: "Resting in His Great Faithfulness",
                    content: `Great is the faithfulness of our Creator toward every person who calls on Him. This daily scripture anchors our identity in the unchanging character of a loving Father. He does not change His mind about you when you struggle or stumble. Therefore, you can rest securely in the knowledge that His promises remain true forever. Stability comes from knowing that the Rock of Ages supports your entire life.`
                  },
                  {
                    title: "Hope Beyond Our Circumstances",
                    content: `Today's bible quote from the book of Lamentations was written during a time of great sorrow. Yet, the prophet chose to focus on the goodness of God instead of his pain. You can make that same choice as you look at your schedule this morning. Hope shines brightest when we remember the many ways God has already helped us. Every new sunrise is a physical reminder that His faithfulness never ends.`
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
                    <h3>Morning Prayer for New Beginnings</h3>
                  </div>
                  <div className="text-muted-foreground leading-relaxed italic"
                    dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`&ldquo;Heavenly Father, I thank You for this verse of today that speaks of Your unending love. Please help me to see Your new mercies in every part of my life this morning. I choose to trust Your faithfulness instead of worrying about the many tasks ahead. Fill my heart with Your peace and guide my words throughout this entire day. I am grateful that Your compassions never fail me in my time of need. Amen.&rdquo;`) }}
                  />
                </div>
                <div className="p-8 rounded-none bg-secondary/30 border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-card-foreground">
                    <span className="text-2xl">🙏</span>
                    <h3>Evening Prayer for Faithful Protection</h3>
                  </div>
                  <div className="text-muted-foreground leading-relaxed italic"
                    dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`&ldquo;Lord, thank You for this day and for Your faithfulness. I reflect on today's bible quote from ${displayVerse.ref} as I prepare to sleep in Your loving care. Forgive me for any moment when I doubted Your presence or relied only on my own effort. Please grant me a restful sleep and renew my spirit for the coming morning. I cast every worry upon You because You are my faithful and strong God. Amen.&rdquo;`) }}
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
                 <h3 className="mb-4 flex items-center gap-2">
                   <span className="text-2xl">📖</span>
                   Extended Scripture Reading on Divine Love
                 </h3>
                 <div className="text-muted-foreground leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`Today's verse from ${displayVerse.ref} connects deeply with many other Bible passages about the power of God and His love. These related scriptures help you understand the full biblical picture of spiritual endurance and grace.`) }}
                 />
                 <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>The bible verse of today morning connects deeply with the overall message of God's sustaining power. This daily morning verse encourages us to look past our immediate struggles to see His hand. When we read Psalm 36:5, we see that His faithfulness reaches even to the high clouds. This means His reliability is far greater than any human support we might find today. Therefore, we can lean heavily on Him without any fear of being let down.</p>`) }} />
                    <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>Transitioning into the afternoon, remember the words of Psalm 100:5 about His everlasting truth. God's goodness endures through every generation and every single season of our lives. This perspective helps us to stay calm when the world around us feels quite chaotic. Your relationship with the Father is the most stable thing in your entire universe right now. Consequently, you can share this hope with others who might be feeling lost or afraid.</p>`) }} />
                    <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>Finally, we must consider the promise in 2 Thessalonians 3:3 regarding our divine protection. The Lord is faithful to establish you and keep you from all evil today. This verse of today serves as a powerful seal on your soul as you work. Hold tightly to the truth that the Almighty God is your constant and loyal friend. He is working behind the scenes to bring beauty out of every difficult situation.</p>`) }} />
                 </div>
               </div>
               
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="p-6 rounded-none bg-card border border-border shadow-sm">
                   <h3 className="mb-3 flex items-center gap-2">
                     <span className="text-xl">💡</span>
                     Key Takeaway
                   </h3>
                   <div className="text-muted-foreground leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`Your soul finds true safety in the presence of a God who has already promised to love you. Trusting this bible verse of today morning changes your entire perspective on every single challenge you face. When you realize that the Almighty God is faithful, the obstacles ahead of you begin to look much smaller. Consequently, you can move forward with bold and quiet confidence in His mercy.`) }}
                   />
                 </div>
                 
                 <div className="p-6 rounded-none bg-card border border-border shadow-sm">
                   <h3 className="mb-3 flex items-center gap-2">
                     <span className="text-xl">🎯</span>
                     Practical Application
                   </h3>
                   <div className="text-muted-foreground leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`Choose one specific worry that is bothering your mind right now during your morning. Then, read ${displayVerse.ref} out loud and consciously hand that specific worry over to the Lord today. You might even write the worry on a piece of paper and then write the words "God is faithful" across it. This simple act of faith turns abstract truth into a tangible reality for your life.`) }}
                   />
                 </div>
               </div>
               
               <div className="p-6 rounded-none bg-secondary/30 border border-border">
                 <h3 className="mb-3 flex items-center gap-2">
                   <span className="text-xl">🤝</span>
                   Community Connection
                 </h3>
                 <div className="text-muted-foreground leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`We are meant to carry each other's heavy burdens as we walk together in this life of faith. Share this baily verse with a friend who is going through a tough time and pray for them. Encouraging someone else with today's bible quote often strengthens your own faith as well. Together, we can remind one another that our God is faithful and He never lets us go.`) }}
                 />
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
                        cat: "Strength in Weakness",
                        catSub: "",
                        ref: "2 Corinthians 12:9",
                        text: "My grace is sufficient for thee: for my strength is made perfect in weakness.",
                        thought: "Your limitation is only a platform for God to show His amazing power today."
                      },
                      {
                        cat: "Divine Guidance",
                        catSub: "",
                        ref: "Psalm 32:8",
                        text: "I will instruct thee and teach thee in the way which thou shalt go.",
                        thought: "God is a gentle teacher who shows you the best path for your life."
                      },
                      {
                        cat: "Perfect Peace",
                        catSub: "",
                        ref: "Isaiah 26:3",
                        text: "Thou wilt keep him in perfect peace, whose mind is stayed on thee.",
                        thought: "Focusing on the Lord brings a tranquility that the world cannot take away."
                      },
                      {
                        cat: "Supernatural Provision",
                        catSub: "",
                        ref: "Philippians 4:19",
                        text: "But my God shall supply all your need according to his riches in glory.",
                        thought: "Trust that every lack in your life will be filled by His abundance."
                      },
                      {
                        cat: "Rest for Souls",
                        catSub: "",
                        ref: "Matthew 11:28",
                        text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
                        thought: "Jesus invites you to trade your heavy burdens for His easy yoke today."
                      },
                      {
                        cat: "Unshakable Foundation",
                        catSub: "",
                        ref: "Psalm 18:2",
                        text: "The LORD is my rock, and my fortress, and my deliverer.",
                        thought: "You are safe because the Creator of the universe is your personal defender."
                      },
                      {
                        cat: "Bright Hope",
                        catSub: "",
                        ref: "Jeremiah 29:11",
                        text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace.",
                        thought: "Your future is secure because it is held in the hands of God."
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
                <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>Today, the bible verse of today morning from Lamentations 3:22-23 gives us a reason to smile through tears. We serve a God who is both infinitely powerful and intimately close to our every single need. He does not just give us a map and leave us to find our way alone. Instead, He takes our hand and walks every step of the journey with us until the end.</p>`) }} />
                <div dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`<p>You can trust Him with your biggest fears and your smallest worries throughout this entire and busy day. Let the truth of our daily scripture sink deep into your heart and transform your entire life now. God is with you, He is for you, and He will never ever let you go.</p>`) }} />
                <div className="text-xl font-serif italic text-primary pt-4"
                  dangerouslySetInnerHTML={{ __html: linkifyBibleVerses(`&ldquo;When you realize that the Almighty God is faithful, fear no longer has the power to hold you back.&rdquo;`) }}
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
