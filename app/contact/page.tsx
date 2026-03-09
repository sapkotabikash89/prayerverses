import type { Metadata } from "next"
import { Mail } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the PrayerVerses team. We would love to hear from you with questions, suggestions, or prayer requests.",
  keywords: ["contact prayerverses", "bible question", "prayer request", "suggest bible verses", "feedback", "christian support", "scripture inquiry", "bible ministry contact", "get in touch bible", "email prayerverses"],
  openGraph: {
    title: "Contact Us",
    description:
      "Get in touch with the PrayerVerses team. We would love to hear from you with questions, suggestions, or prayer requests.",
    type: "website",
  },
  alternates: { canonical: "https://prayerverses.com/contact/" },
  robots: { index: true, follow: true },
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-10">
      <Breadcrumb items={[{ label: "Contact", href: "/contact/" }]} />
      <h1 className="text-3xl font-serif font-bold text-card-foreground mb-2 lg:text-4xl">
        Contact Us
      </h1>
      <div className="flex flex-col gap-8">
        <p className="text-base leading-relaxed text-card-foreground">
          We&apos;d love to hear from you!
        </p>
        <p className="text-base leading-relaxed text-card-foreground">
          Whether you have a question, suggestion, or simply want to share how Prayer Verses has helped you, feel free to reach out. We&apos;re always open to feedback, new ideas, or ways to improve the experience for our readers.
        </p>

        <div className="rounded-none border border-border bg-card p-6 lg:p-8">
          <p className="text-base font-semibold text-card-foreground mb-4">You can contact us anytime by email:</p>
          <div className="flex items-center gap-4 text-primary font-bold">
            <span className="text-2xl">📧</span>
            <a href="mailto:info@prayerverses.com" className="hover:underline text-lg">info@prayerverses.com</a>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold text-card-foreground mb-6">Prayer Verses Social Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Pinterest", href: "https://www.pinterest.com/prayerverses/", icon: "📌" },
              { name: "Facebook", href: "https://www.facebook.com/prayerverseswebsite/", icon: "👥" },
              { name: "Instagram", href: "https://www.instagram.com/prayerverseswebsite/", icon: "📸" },
              { name: "X", href: "https://x.com/prayerversesweb", icon: "🐦" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-none border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <span className="text-xl">{social.icon}</span>
                <span className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        <p className="text-base leading-relaxed text-muted-foreground bg-secondary/30 p-6 rounded-none border border-border italic">
          We do our best to respond within 48 hours on weekdays. If it&apos;s about something urgent or important, kindly mention it in the subject line so we can prioritize your message.
        </p>

        <p className="text-base leading-relaxed text-card-foreground">
          Thank you for being a part of Prayer Verses. Your voice matters.
        </p>

        <div className="mt-4">
          <p className="text-lg font-serif font-bold text-card-foreground">Blessings,</p>
          <p className="text-base text-card-foreground">The Prayer Verses Team</p>
        </div>
      </div>
    </div>
  )
}
