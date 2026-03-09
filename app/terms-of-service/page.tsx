import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "PrayerVerses terms of service. Understand the terms governing your use of our Bible verse platform.",
  keywords: ["terms of service", "user agreement", "prayerverses terms", "website rules", "usage policy", "legal terms", "bible website terms", "christian site rules", "service agreement", "legal conditions"],
  openGraph: {
    title: "Terms of Service",
    description: "PrayerVerses terms of service. Understand the terms governing your use of our Bible verse platform.",
    type: "website",
  },
  alternates: { canonical: "https://prayerverses.com/terms-of-service/" },
  robots: { index: true, follow: true },
}

export default function TermsOfServicePage() {
  return (
    <article className="post-content">
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-10">
        <Breadcrumb items={[{ label: "Terms of Service", href: "/terms-of-service/" }]} />
        <h1 className="text-3xl font-serif font-bold text-card-foreground mb-6 lg:text-4xl">
          Terms of Service
        </h1>
        <div className="flex flex-col gap-8 text-base leading-relaxed text-card-foreground">
          <div className="space-y-1 text-sm text-muted-foreground bg-secondary/30 p-4 rounded-none border border-border">
            <p>Effective Date: March 8, 2026</p>
            <p>Website: https://prayerverses.com</p>
          </div>

          <p>By using this website, you agree to follow these Terms and Conditions. Please read them carefully before using Prayer Verses.</p>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">1. Use of Website</h2>
            <p className="mb-4">This website is meant for personal and non-commercial use. You are welcome to read, share, or print the content, as long as you don&apos;t change it or sell it.</p>
            <p>You agree not to misuse the website in any way, including:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Posting spam or harmful content</li>
              <li>Copying large amounts of content without permission</li>
              <li>Trying to access restricted areas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">2. Bible Content and Prayers</h2>
            <p>All the Bible verses, explanations, and prayers are provided to support your faith journey, not to replace professional or personal advice. We aim to be accurate and respectful to Scripture, but the final interpretation is up to you.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">3. Intellectual Property</h2>
            <p className="mb-4">All content on Prayer Verses (like text, images, and layout) is owned by us or properly credited. You may:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Share content with proper credit and a link back to <a href="https://prayerverses.com" className="text-primary hover:underline">https://prayerverses.com</a></li>
              <li>Not copy full pages or create a copy of our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">4. External Links</h2>
            <p>We may link to other helpful websites. But we do not control those sites and are not responsible for their content or privacy practices.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">5. Limitation of Liability</h2>
            <p>We are not liable for any loss, injury, or damage from using our website. This includes actions you take based on the information you read here.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">6. Changes to Terms</h2>
            <p>We may update these terms when needed. Any updates will be posted on this page with the new date.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">7. Contact</h2>
            <p>If you have any questions about these Terms, email us at:</p>
            <p className="mt-4 font-bold">📧 <a href="mailto:info@prayerverses.com" className="text-primary hover:underline">info@prayerverses.com</a></p>
          </section>

          <p className="text-center font-serif font-bold text-primary mt-8">
            Thank you for using Prayer Verses. We&apos;re here to serve with truth and encouragement from the Bible.
          </p>
        </div>
      </div>
    </article>
  )
}
