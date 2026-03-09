import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "PrayerVerses disclaimer. Important information about the content and resources provided on our platform.",
  keywords: ["disclaimer", "content warning", "prayerverses disclaimer", "legal notice", "information disclaimer", "scripture disclaimer", "website notice", "content policy", "christian site disclaimer", "legal information"],
  openGraph: {
    title: "Disclaimer",
    description: "PrayerVerses disclaimer. Important information about the content and resources provided on our platform.",
    type: "website",
  },
  alternates: { canonical: "https://prayerverses.com/disclaimer/" },
  robots: { index: true, follow: true },
}

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-10">
      <Breadcrumb items={[{ label: "Disclaimer", href: "/disclaimer/" }]} />
      <h1 className="text-3xl font-serif font-bold text-card-foreground mb-6 lg:text-4xl">
        Disclaimer
      </h1>
      <div className="flex flex-col gap-8 text-base leading-relaxed text-card-foreground">
        <div className="space-y-1 text-sm text-muted-foreground bg-secondary/30 p-4 rounded-none border border-border">
          <p>Effective Date: March 8, 2026</p>
          <p>Website: https://prayerverses.com</p>
        </div>

        <p className="text-lg italic font-serif text-muted-foreground border-l-4 border-primary/20 pl-6 py-2">
          The content on Prayer Verses is provided for spiritual encouragement, inspiration, and personal growth. It is not intended as professional, legal, medical, or counseling advice.
        </p>

        <section>
          <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">1. Not a Substitute for Professional Help</h2>
          <p>While we share Bible verses, prayers, and reflections to support your faith, these are not a replacement for help from licensed professionals. If you&apos;re facing a medical issue, mental health struggle, or legal concern, please speak with a qualified expert.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">2. Accuracy of Information</h2>
          <p className="mb-4">We do our best to provide accurate and clear information from the Bible and trusted sources. But we cannot guarantee that every verse interpretation or prayer will apply to every person&apos;s situation.</p>
          <p>Bible translations, interpretations, and applications may vary based on personal belief, denomination, or context. Please use personal discretion and prayerful wisdom when applying content to your life.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">3. External Links</h2>
          <p>We sometimes link to outside websites for reference or further reading. We do not control or endorse the content on those sites and are not responsible for what they share.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">4. Use at Your Own Risk</h2>
          <p>By using this website, you understand that you are doing so at your own risk. We are not liable for any decisions or actions you take based on what you read here.</p>
        </section>

        <section>
          <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">5. Contact Us</h2>
          <p>If you have any questions about this disclaimer, please email us at:</p>
          <p className="mt-4 font-bold">📧 <a href="mailto:info@prayerverses.com" className="text-primary hover:underline">info@prayerverses.com</a></p>
        </section>

        <p className="text-center font-serif font-bold text-primary text-xl mt-8">
          Thank you for using Prayer Verses. We pray that this site encourages your walk with God.
        </p>
      </div>
    </div>
  )
}
