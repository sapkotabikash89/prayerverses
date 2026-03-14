import Image from "next/image"
import { Category } from "@/lib/wordpress"

export function SiteFooter({ categories = [] }: { categories?: Category[] }) {
  const footerLinks = {
    Explore: [
      { href: "/verse-of-the-day/", label: "Daily Verses" },
      { href: "/random-verse/", label: "Random Verse" },
      { href: "/books-of-the-bible/", label: "Books of the Bible" },
      { href: "/search/", label: "Search" },
    ],
    Categories: categories.slice(0, 6).map(cat => ({
      href: `/category/${cat.slug}/`,
      label: cat.name
    })),
    Legal: [
      { href: "/about/", label: "About Us" },
      { href: "/contact/", label: "Contact" },
      { href: "/privacy-policy/", label: "Privacy Policy" },
      { href: "/terms-of-service/", label: "Terms of Service" },
      { href: "/disclaimer/", label: "Disclaimer" },
    ],
  }

  return (
    <footer className="bg-secondary/50 text-foreground border-t border-border site-footer pt-12 pb-8">
      <div className="mx-auto max-w-[1200px] px-2 py-8 lg:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="/" className="group flex items-center gap-2 mb-4 transition-colors">
              <Image
                src="/prayer-verses-logo.webp"
                alt="PrayerVerses Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain transition-all"
              />
              <span className="text-xl font-serif font-bold text-primary transition-colors">PrayerVerses</span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your daily source of inspiration and spiritual guidance through God&apos;s Word. Discover, share, and reflect on beautiful Bible verses, and prayers every day.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-4 italic">
              ♡ Made with love for the Kingdom of God
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h5 className="font-bold text-card-foreground mb-4 mt-0">
                {title}
              </h5>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} PrayerVerses. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
