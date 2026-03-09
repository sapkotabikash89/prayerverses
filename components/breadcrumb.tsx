import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  // Add Home at the beginning
  const allItems = [{ label: "Home", href: "/" }, ...items]

  // Breadcrumb Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://prayerverses.com${item.href}`
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center flex-wrap text-xs text-muted-foreground lg:text-sm">
        <ol className="flex items-center flex-wrap gap-1.5">
          {allItems.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
              {index === allItems.length - 1 ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  {index === 0 && <Home className="h-3.5 w-3.5" />}
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
