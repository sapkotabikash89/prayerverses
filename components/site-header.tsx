"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search, ChevronDown } from "lucide-react"
import { bibleBooks } from "@/data/bible"
import { Button } from "@/components/ui/button"
import { Category } from "@/lib/wordpress"

const defaultNavLinks = [
  { href: "/", label: "Home" },
  { href: "/verse-of-the-day/", label: "Daily Verses" },
  { href: "/random-verse/", label: "Random Verse" },
  { href: "/books-of-the-bible/", label: "Books of the Bible" },
]

export function SiteHeader({ categories = [] }: { categories?: Category[] }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [bibleDropdown, setBibleDropdown] = useState(false)
  const [categoriesDropdown, setCategoriesDropdown] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/prayer-verses-logo.webp"
            alt="PrayerVerses Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-serif font-bold text-primary">
            PrayerVerses
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {defaultNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-secondary-foreground rounded-md hover:bg-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Categories Dropdown */}
          <div className="relative">
            <Link
              href="/categories/"
              onClick={(e) => {
                e.preventDefault();
                setCategoriesDropdown(!categoriesDropdown);
              }}
              onBlur={() => setTimeout(() => setCategoriesDropdown(false), 200)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-secondary-foreground rounded-md hover:bg-secondary transition-colors"
              aria-expanded={categoriesDropdown}
              aria-haspopup="true"
            >
              Categories
              <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            {categoriesDropdown && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-card border border-border rounded-lg shadow-lg p-2 z-50">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}/`}
                      className="block px-3 py-2 text-sm text-secondary-foreground rounded-md hover:bg-secondary transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs text-muted-foreground">Loading categories...</p>
                )}
              </div>
            )}
          </div>

          {/* Bible Dropdown */}
          <div className="relative">
            <Link
              href="/books-of-the-bible/"
              onClick={(e) => {
                e.preventDefault();
                setBibleDropdown(!bibleDropdown);
              }}
              onBlur={() => setTimeout(() => setBibleDropdown(false), 200)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-secondary-foreground rounded-md hover:bg-secondary transition-colors"
              aria-expanded={bibleDropdown}
              aria-haspopup="true"
            >
              Bible
              <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            {bibleDropdown && (
              <div className="absolute right-0 top-full mt-1 w-[540px] bg-card border border-border rounded-lg shadow-lg p-4 grid grid-cols-3 gap-1 max-h-[70vh] overflow-y-auto z-50">
                <p className="col-span-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-2">
                  Old Testament
                </p>
                {bibleBooks
                  .filter((b) => b.testament === "OT")
                  .map((book) => (
                    <Link
                      key={book.slug}
                      href={`/bible/${book.slug}/`}
                      className="block px-2 py-1 text-xs text-secondary-foreground rounded hover:bg-secondary transition-colors"
                    >
                      {book.name}
                    </Link>
                  ))}
                <p className="col-span-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3 mb-1 px-2">
                  New Testament
                </p>
                {bibleBooks
                  .filter((b) => b.testament === "NT")
                  .map((book) => (
                    <Link
                      key={book.slug}
                      href={`/bible/${book.slug}/`}
                      className="block px-2 py-1 text-xs text-secondary-foreground rounded hover:bg-secondary transition-colors"
                    >
                      {book.name}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Search + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link href="/search/" aria-label="Search">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-primary"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav
          className="lg:hidden border-t border-border bg-card px-4 pb-4"
          aria-label="Mobile navigation"
        >
          {defaultNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-medium text-secondary-foreground border-b border-border/50 last:border-0"
            >
              {link.label}
            </Link>
          ))}

          <div className="py-2">
            <p className="px-1 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Blog Categories
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}/`}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-secondary-foreground pl-2"
              >
                {cat.name}
              </Link>
            ))}
          </div>

        </nav>
      )}
    </header>
  )
}
