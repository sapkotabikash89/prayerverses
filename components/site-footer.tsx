import Link from "next/link"
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
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="group flex items-center gap-2 mb-4 transition-colors hover:text-black">
              <Image
                src="/prayer-verses-logo.webp"
                alt="PrayerVerses Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain transition-all"
              />
              <span className="text-xl font-serif font-bold transition-colors">PrayerVerses</span>
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Your daily source of inspiration and spiritual guidance through God&apos;s Word. Discover, share, and reflect on beautiful Bible verses, and prayers every day.
            </p>
            <p className="text-xs text-primary-foreground/60 mt-4 italic">
              ♡ Made with love for the Kingdom of God
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/60">
                {title}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} PrayerVerses. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
