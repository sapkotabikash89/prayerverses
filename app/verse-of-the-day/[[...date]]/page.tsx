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
                    title: "What It Means to Be Conformed",
                    content: `The word "conform" in Romans 12:2 carries a vivid picture. It describes something being pressed into a mold. Think of clay being shaped by an outside force. Every day, the world around us tries to do exactly that. Our culture shapes opinions, values, and desires in very subtle ways. Paul therefore warns believers to recognize this pressure. He also urges them to actively resist it. When you scroll through social media without a filter, the world is shaping you. When you absorb news without discernment, culture is pressing you into its mold. Awareness is the very first step toward freedom. Scripture passages like 1 John 2:15-17 and James 4:4 also warn believers about the danger of loving the world's system more than God.`
                  },
                  {
                    title: "The Power of a Renewed Mind",
                    content: `Paul does not just warn believers. He also gives them the answer: transformation through the renewal of the mind. Renewal here is not a one-time event. Rather, it is a beautiful ongoing process, much like a daily shower that washes off the dirt of the day. This renewal happens through reading God's Word consistently, as taught in Joshua 1:8 and Psalm 119:105. It also grows through prayer, worship, and spending time in community with other believers. Additionally, it deepens through choosing good and godly thoughts, especially when negative ones arrive. Over time, a renewed mind begins to see life differently. It starts thinking about situations the way God thinks about them. Consequently, decisions become clearer, peace grows stronger, and purpose feels more alive.`
                  },
                  {
                    title: "Discerning the Perfect Will of God",
                    content: `The beautiful promise at the end of Romans 12:2 is this: a renewed mind helps believers discern God's will. Many Christians genuinely struggle to know what God wants them to do in specific situations. However, Scripture reveals that the answer starts in the mind. When you fill your mind with Scripture like Proverbs 3:5-6 and Colossians 3:16, you begin to think in harmony with God's nature. As a result, His will becomes clearer and easier to recognize. This does not mean every decision comes with a dramatic sign from heaven. Instead, a well-nourished mind simply begins to sense what is good, acceptable, and perfect in God's sight. Furthermore, the Holy Spirit works through a Word-filled mind to guide, nudge, and confirm the right path. Start renewing your mind today, and watch how much better your direction in life becomes.`
                  },
                  {
                    title: "Building Spiritual Discipline Every Day",
                    content: `Consistency matters more than intensity in spiritual growth. Reading God's Word for ten minutes every single morning produces far more transformation than a two-hour session once a month. Therefore, start small and stay steady. Read Romans 12:1-2 today, reflect on its meaning, and then respond with a simple prayer of surrender. Over time, these small daily deposits of Scripture compound into deep spiritual maturity. Additionally, find a pattern that works for your life. Some people meditate on a verse during their morning coffee. Others listen to Scripture during a commute. The method matters far less than the habit itself. As Hebrews 10:24-25 reminds believers, staying connected to the community of faith also accelerates this renewal process. Together, believers sharpen one another and stay rooted in truth.`
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
                    <h3>Morning Prayer for a Renewed Mind</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;Heavenly Father, I bring my mind before You this morning. Thank You for the truth of Romans 12:2. I choose today not to be pressed into the world's mold. Transform my thoughts, Father, and fill my mind with Your Word. Help me see my circumstances through Your eyes. Guide every decision I make today by Your good and perfect will. In Jesus' mighty name, Amen.&rdquo;
                  </p>
                </div>
                <div className="p-8 rounded-none bg-secondary/30 border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-card-foreground">
                    <span className="text-2xl">🙏</span>
                    <h3>Evening Prayer for Spiritual Protection</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    &ldquo;Lord, thank You for this day and for Your faithfulness. Forgive me for the moments when I allowed the world's thinking to influence me more than Your Word did. Tonight, as I rest, guard my heart and mind through Christ Jesus, as Philippians 4:7 promises. Renew me as I sleep. Let me rise tomorrow with a mind that is sharper, clearer, and more aligned with Your truth. Amen.&rdquo;
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
                   Extended Scripture Reading on Mind Renewal
                 </h3>
                 <p className="text-muted-foreground leading-relaxed mb-4">
                   Today's verse from Romans 12:2 connects deeply with many other Bible passages about the power of the mind and the call to holy living. These related scriptures help you understand the full biblical picture of transformation.
                 </p>
                 <div className="space-y-4 text-muted-foreground">
                   <p><strong>Philippians 4:8</strong> instructs believers to fix their thoughts on things that are true, noble, right, pure, lovely, and admirable. This verse acts as a practical checklist for a renewed mind. Before consuming any content, a believer can ask: does this pass the Philippians 4:8 test?</p>
                   <p><strong>Colossians 3:1-2</strong> adds another layer, urging believers to set their minds on things above, not on earthly things. Together with Romans 12:2, this paints a picture of a mind that is anchored in heaven even while living on earth.</p>
                   <p><strong>2 Corinthians 10:5</strong> takes it further still, calling believers to take every thought captive and make it obedient to Christ. This reveals that transformation is not just passive. Rather, it requires active, intentional spiritual warfare over the thought life.</p>
                   <p>Finally, <strong>Ephesians 4:22-24</strong> connects mind renewal directly to putting off the old self and putting on the new self created in God's likeness. All these passages together reveal a consistent biblical theme: who you become starts with what you think.</p>
                 </div>
               </div>
               
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="p-6 rounded-none bg-card border border-border shadow-sm">
                   <h3 className="mb-3 flex items-center gap-2">
                     <span className="text-xl">💡</span>
                     Key Takeaway
                   </h3>
                   <p className="text-muted-foreground leading-relaxed">
                     Transformation is not about trying harder. It is about thinking differently. When you consistently feed your mind with God's Word, your behavior naturally follows. Romans 12:2 teaches that a changed life always starts with a changed mind. So today, focus on what goes into your mind. Scripture, worship music, and prayer all fuel the renewal that changes everything else.
                   </p>
                 </div>
                 
                 <div className="p-6 rounded-none bg-card border border-border shadow-sm">
                   <h3 className="mb-3 flex items-center gap-2">
                     <span className="text-xl">🎯</span>
                     Practical Application
                   </h3>
                   <p className="text-muted-foreground leading-relaxed">
                     Choose one area of your thinking where the world's influence feels strongest. Perhaps it is anxiety about money, bitterness toward someone, or discouragement about your future. Then find a specific Bible verse that addresses that exact area. Write it down and repeat it out loud throughout today. This is exactly what Romans 12:2 looks like in daily action. Over time, consistent application of God's Word to specific thought patterns produces remarkable change.
                   </p>
                 </div>
               </div>
               
               <div className="p-6 rounded-none bg-secondary/30 border border-border">
                 <h3 className="mb-3 flex items-center gap-2">
                   <span className="text-xl">🤝</span>
                   Community Connection
                 </h3>
                 <p className="text-muted-foreground leading-relaxed">
                   Renewal does not happen in isolation. Hebrews 10:24-25 encourages believers to meet together regularly and to spur one another on toward love and good deeds. Share Romans 12:2 with a friend today and ask them: where in your life is your mind most shaped by the world right now? That simple conversation might be the spark that starts genuine transformation for both of you.
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
                        cat: "Scripture for Morning Focus",
                        ref: "Philippians 4:8",
                        text: "Whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable — think about such things.",
                        thought: "Your mind shapes your mood and your day. Feed it with God's truth every single morning and watch your whole perspective shift."
                      },
                      {
                        cat: "Verse for Resisting Temptation",
                        ref: "James 4:7",
                        text: "Submit yourselves therefore to God. Resist the devil, and he will flee from you.",
                        thought: "Spiritual victory starts with surrender. When you submit your will to God, He gives you the power to stand firm."
                      },
                      {
                        cat: "Daily Verse on Transformation",
                        ref: "2 Corinthians 5:17",
                        text: "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.",
                        thought: "You are not who you used to be. In Christ, genuine change is not just possible. It has already begun inside you."
                      },
                      {
                        cat: "Scripture on Spiritual Growth",
                        ref: "Colossians 3:10",
                        text: "And have put on the new self, which is being renewed in knowledge after the image of its creator.",
                        thought: "Renewal is an active, daily process. Each choice to think God's way brings you closer to who He created you to be."
                      },
                      {
                        cat: "Verse on God's Guidance",
                        ref: "Proverbs 3:5-6",
                        text: "Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
                        thought: "When your mind aligns with God's Word, your path becomes clear. Trust brings direction that human logic alone cannot provide."
                      },
                      {
                        cat: "Scripture for Inner Strength",
                        catSub: "(Ephesians)",
                        ref: "Ephesians 4:23",
                        text: "Be renewed in the spirit of your minds.",
                        thought: "Spiritual renewal is not automatic. It is a choice you make every day to think, speak, and act according to God's values."
                      },
                      {
                        cat: "Promise for Today",
                        ref: "Isaiah 26:3",
                        text: "You keep him in perfect peace whose mind is stayed on you, because he trusts in you.",
                        thought: "A mind fixed on God rests in perfect peace. No matter what today brings, anchoring your thoughts in Him brings deep calm."
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
                  Today, Romans 12:2 presents every believer with a clear fork in the road. One path follows the world's patterns, its thinking, its values, and its version of success. The other path follows the renewing power of God's Word. Choosing the second path does not happen just once. Rather, you make that choice again and again, thought by thought, decision by decision, moment by moment throughout the day.
                </p>
                <p>
                  Thankfully, you do not make that choice alone. The Holy Spirit works within you to renew your thinking. He makes the things of God attractive, and He makes the things of the world lose their grip. So lean into that work today. Open your Bible. Pray. Worship. And trust that as your mind is renewed, your whole life will follow.
                </p>
                <p className="text-xl font-serif italic text-primary pt-4">
                  &ldquo;You cannot think the same thoughts and expect a different life. Let God renew your mind, and transformation will follow naturally.&rdquo;
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
