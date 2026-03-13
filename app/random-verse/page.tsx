import type { Metadata } from "next"
import { getAllVerses } from "@/lib/bible-text"
import { RandomVerseClient } from "@/components/random-verse-client"
import { Breadcrumb } from "@/components/breadcrumb"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Random Bible Verse",
  description: "Get a random Bible verse to inspire your day and strengthen your faith.",
  robots: { index: true, follow: true },
  keywords: ["random bible verse", "bible verse generator", "random scripture", "bible passage", "spontaneous bible quotes", "spiritual guidance", "bible verses for inspiration", "daily scripture", "bible study tool", "christian meditation"],
  alternates: {
    canonical: "/random-verse/",
  },
  openGraph: {
    title: "Random Bible Verse",
    description: "Get a random Bible verse to inspire your day and strengthen your faith.",
    type: "website",
    images: [{ url: "/random-bible-verse.webp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Bible Verse",
    description: "Get a random Bible verse to inspire your day and strengthen your faith.",
    images: ["/random-bible-verse.webp"],
  },
}

export default async function RandomVersePage() {
  const bibleVerses = await getAllVerses()
  const allVerses = bibleVerses.map(v => ({
    text: v.text,
    reference: v.reference
  }))

  const initialVerse = allVerses[Math.floor(Math.random() * allVerses.length)]

  const faqs = [
    {
      question: "How many random Bible verses can I generate per day?",
      answer: "There is no limit to how many scriptures you can discover. Our Random Bible Verse Generator allows you to click and generate as many verses as you need for inspiration, study, or meditation throughout your day."
    },
    {
      question: "Can I share these random verses on social media?",
      answer: "Yes! Every verse generated comes with built-in sharing tools. You can instantly post your favorite Bible quotes to Facebook, Twitter, or send them via email to encourage your friends and family with the Word of God."
    },
    {
      question: "Is it possible to download the Bible verse as an image?",
      answer: "Absolutely. By clicking the 'Download' button, you can save the beautifully designed verse card as a high-quality PNG image file. This is perfect for using as a phone wallpaper, printing for a devotional journal, or sharing on visual platforms like Instagram."
    },
    {
      question: "Can I customize the look of the verse card?",
      answer: "Yes, you can personalize your experience. Our tool offers multiple gradient background themes and styles (such as Sunrise, Forest, and Sky), allowing you to choose the design that best reflects the mood or message of the scripture."
    },
    {
      question: "What are the spiritual benefits of reading a random Bible verse daily?",
      answer: "Engaging with a daily random verse helps you maintain a consistent connection with God's Word. It provides timely encouragement, spiritual guidance during moments of uncertainty, and helps center your mind on biblical truths regardless of how busy your schedule may be."
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <article className="post-content">
        <div className="bg-secondary/30 border-b border-border py-8 lg:py-10">
          <div className="text-center px-4">
            <div className="flex justify-start mb-8">
              <Breadcrumb items={[{ label: "Random Bible Verse", href: "/random-verse/" }]} />
            </div>
            <h1>
              Random Bible Verse
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-lg mx-auto">
              Let God speak to you through a randomly selected verse from Scripture.
            </p>

            <RandomVerseClient initialVerse={initialVerse} allVerses={allVerses} />

            <div className="mt-8 max-w-3xl mx-auto">
            </div>
          </div>
        </div>

        <div className="py-8">
          <div className="flex flex-col gap-16">
            {/* Introduction Section */}
            <section className="prose prose-stone max-w-none dark:prose-invert">
              <div className="rounded-none bg-card border border-border p-8 lg:p-12 shadow-sm">
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                  Are you seeking daily inspiration, a word of encouragement, or just want to feel spiritually connected anytime during your day? Our Random Bible Verse Generator is the perfect tool to draw you closer to God—one verse at a time.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Whether you're starting your morning, needing a midday boost, or ending your day on a peaceful note, a random Bible verse can be exactly what your soul needs.
                </p>
              </div>
            </section>

            {/* What Is Section */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 border-b border-border pb-4">
                What Is a Random Bible Verse Generator?
              </h2>
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    A Random Bible Verse Generator is a digital tool that delivers a single, randomly selected Bible verse from the Holy Scriptures with just one click.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    If you are looking for a random Bible passage, random Bible scripture, or simply a moment of divine encouragement, this tool provides quick access to God’s Word in a refreshingly spontaneous way.
                  </p>
                  <p className="font-serif italic text-primary text-lg">
                    "Think of it as a spiritual companion that surprises you with the right message at the right time."
                  </p>
                </div>
                <div className="bg-secondary/30 rounded-none p-6 border border-border">
                  <h4 className="font-bold text-card-foreground mb-4">It’s especially helpful for people who:</h4>
                  <ul className="space-y-3">
                    {["Don’t know where to begin reading the Bible", "Need guidance or comfort in the moment", "Want to make Bible reading more engaging and dynamic"].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 w-5 h-5 rounded-none bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Whether you’re on your phone while commuting, sitting at your desk on a lunch break, or relaxing at home in the evening, the random Bible text generator brings you closer to God’s Word without flipping through pages or making decisions about where to start.
                </p>
                <p>
                  And since the verse is selected randomly, it often feels as though God is speaking directly to your heart, offering encouragement, correction, peace, or joy—exactly when you need it most.
                </p>
              </div>
            </section>


            {/* Why Use Section */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 border-b border-border pb-4">
                Why Use a Random Bible Verse Generator?
              </h2>
              <p className="text-muted-foreground mb-10">
                There are many reasons people love using a random Bible verse generator. It's not just a fun or novel feature—it’s a spiritually enriching tool with real, everyday benefits. Here's a deeper look at why this tool has become a favorite among believers around the world:
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "✝️ 1. Instant Spiritual Nourishment",
                    text: "Life can be overwhelming, and sometimes, all it takes is a single Bible verse to uplift your soul. Each random verse becomes a bite-sized piece of spiritual food that strengthens your faith."
                  },
                  {
                    title: "⏰ 2. Perfect for Busy Lifestyles",
                    text: "In today’s fast-paced world, many struggle to find time for entire chapters. This tool gives you a meaningful and powerful Bible message in just a few seconds."
                  },
                  {
                    title: "📱 3. Easy to Use Anywhere",
                    text: "Designed to be accessible on all devices. No apps or sign-ups required—just one click for a spiritual gem on your phone, tablet, or computer."
                  },
                  {
                    title: "💬 4. Great for Sharing God’s Word",
                    text: "Spread the love of Christ easily. Each verse comes with a “Share” button to instantly post to social media or send to loved ones."
                  },
                  {
                    title: "🙏 5. Great for Prayer and Meditation",
                    text: "A perfect starting point for personal prayer, journaling, or quiet meditation. These spontaneous verses often feel like divine appointments."
                  }
                ].map((benefit, i) => (
                  <div key={i} className="p-6 rounded-none border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-primary mb-3">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-center text-muted-foreground italic">
                "In short, the Random Bible Verse Generator is more than just a fun tool—it’s a modern way to engage with timeless truths."
              </p>
            </section>

            {/* How to Use Section */}
            <section className="bg-secondary/20 rounded-none p-8 lg:p-12 border border-border">
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 text-center">
                How to Use Our Random Bible Verse Generator [Step-by-Step Guide]
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { step: "Step 1", title: "Click \"Generate Random Verse\"", text: "Click the button and a random scripture will appear on a beautifully designed verse card." },
                  { step: "Step 2", title: "Copy the Verse", text: "Want to save it or send it? Click the \"Copy\" button to paste anywhere instantly." },
                  { step: "Step 3", title: "Share the Verse", text: "Hit the \"Share\" button to instantly share the quote on your favorite platform." },
                  { step: "Step 4", title: "Download the Verse Card", text: "Click \"Download\" to save the card as a JPEG image—perfect for wallpaper or journaling." },
                  { step: "Step 5", title: "Customize Your Verse Card", text: "Click \"Customize\" to upload backgrounds or choose from beautiful gradients." },
                  { step: "Step 6", title: "View Full Details", text: "For a deeper understanding, click \"View Full\" to explore the verse detail, including meaning, context, and interpretation." }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{step.step}</span>
                    <h4 className="font-bold text-card-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center text-sm text-muted-foreground">
                You can repeat this as many times as you want. Generate unlimited random verses anytime, anywhere.
              </p>
            </section>

            {/* Daily Habit Section */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 border-b border-border pb-4">
                Benefits of Checking a Random Bible Texts Daily
              </h2>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                Establishing a daily habit of reading a random Bible verse might seem small—but its impact is profound. By incorporating the use of a random Bible verse generator into your daily routine, you open your heart to spontaneous spiritual insights that can uplift, guide, and transform your life.
              </p>

              <div className="space-y-8">
                {[
                  {
                    icon: "🌅",
                    time: "Morning",
                    title: "Start Your Day Blessed",
                    text: "Mornings set the spiritual tone for the rest of the day. Instead of diving straight into emails or social media, imagine starting your day with a random Bible scripture—a message straight from the Word of God.",
                    points: ["It fills your heart with peace before the chaos begins", "It sharpens your focus and reminds you of your purpose", "It turns your morning into a sacred moment of reflection"]
                  },
                  {
                    icon: "🌇",
                    time: "Afternoon",
                    title: "Recharge Your Soul",
                    text: "Afternoons are often where we hit a wall—mentally, emotionally, and spiritually. Whether you’re facing a challenging task or just feeling drained, this is the perfect time to pause and seek refreshment.",
                    points: ["Offer encouragement when you're feeling tired or defeated", "Give perspective when you’re overwhelmed or anxious", "Uplift your mood with a timely verse of hope, strength, or grace"]
                  },
                  {
                    icon: "🌙",
                    time: "Night",
                    title: "Sleep with Peace",
                    text: "Nighttime is when your thoughts settle and your heart becomes more open to reflection. Ending your day with a random Bible verse brings closure, gratitude, and peace.",
                    points: ["You release the stress and burdens of the day", "You find comfort in God's promises", "You quiet your mind with His truth, rather than anxious thoughts"]
                  }
                ].map((habit, i) => (
                  <div key={i} className="flex flex-col lg:flex-row gap-8 items-start p-8 rounded-none bg-card border border-border shadow-sm">
                    <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-none bg-secondary text-3xl">
                      {habit.icon}
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1 block">{habit.time}</span>
                      <h3 className="text-xl font-bold text-card-foreground mb-3">{habit.title}</h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{habit.text}</p>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {habit.points.map((point, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-none bg-primary/40" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>


            {/* Transformation Section */}
            <section className="text-center bg-primary/5 rounded-none p-8 lg:p-12 border border-primary/10">
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-6 flex items-center justify-center gap-3">
                <span className="text-3xl">📖</span> Daily Bible Verses, Daily Transformation
              </h2>
              <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
                Even one random Bible quote a day can bring lasting change:
              </p>
              <div className="grid gap-6 sm:grid-cols-3 mb-10">
                {[
                  { icon: "🛡️", title: "Spiritual Growth", text: "You draw closer to God, one verse at a time." },
                  { icon: "😊", title: "Emotional Strength", text: "You find peace, hope, and encouragement for any situation." },
                  { icon: "🕊️", title: "Mental Clarity", text: "You replace noise and negativity with truth and purpose." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-3xl mb-3">{item.icon}</span>
                    <h4 className="font-bold text-card-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
              <p className="font-medium text-primary italic">
                "It’s not about how much you read—it’s about how consistently you let the Word of God into your life."
              </p>
            </section>

            {/* Why This Website Section */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 border-b border-border pb-4">
                Why Use Our Random Bible Verse Generator on This Website?
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Unlimited Verse Generation", text: "Keep clicking “Generate Random Verse” as many times as you want—no limits!" },
                  { title: "Copy, Share, Download Instantly", text: "Whether you're journaling, posting, or saving—it's all one click away." },
                  { title: "Customize Your Experience", text: "Choose your favorite verse design with 8 eye-catching gradient themes or upload personal images." },
                  { title: "Deep Dive Into Scripture", text: "Click “View Full” to explore verse meanings and explanations." },
                  { title: "No App Needed", text: "Accessible right on your browser. Lightweight, fast, and responsive on all devices." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-none bg-card border border-border">
                    <span className="flex-shrink-0 w-6 h-6 rounded-none bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs font-bold">✓</span>
                    <div>
                      <h4 className="font-bold text-card-foreground mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Closing Section */}
            <section className="text-center py-8">
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-4">
                Random Bible Verses: Small Verses, Big Impact
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
                You don’t have to spend hours flipping pages to hear from God. One random Bible scripture can remind you that you're not alone, reignite your faith, offer hope during tough times, and keep your spirit uplifted.
              </p>
              <p className="text-xl font-serif italic text-primary">
                That’s the beauty of a random Bible verse generator—it finds the verse you didn’t know you needed.
              </p>
            </section>

            {/* FAQ Section */}
            <section className="mt-16">
              <h2 className="text-2xl font-serif font-bold text-card-foreground mb-8 text-center">
                FAQs about Random Bible Verse Generator
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
        </div>
      </article>
    </>
  )
}
