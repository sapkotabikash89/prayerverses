import { ExternalLink } from "lucide-react"

interface VerseTranslationsProps {
  reference: string
  bookName: string
  chapter: number
  verse: number
  kjvText: string
}

interface Translation {
  id: string
  name: string
  text?: string
  url: string
}

export function VerseTranslations({ reference, bookName, chapter, verse, kjvText }: VerseTranslationsProps) {
  const translations: Translation[] = [
    { id: 'KJV', name: 'King James Version', text: kjvText, url: `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=KJV` },
    { id: 'NIV', name: 'New International Version', url: `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=NIV` },
    { id: 'ESV', name: 'English Standard Version', url: `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=ESV` },
    { id: 'NLT', name: 'New Living Translation', url: `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=NLT` },
    { id: 'WEB', name: 'World English Bible', url: `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=WEB` },
    { id: 'NKJV', name: 'New King James Version', url: `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=NKJV` },
  ]

  return (
    <section className="mb-16">
      <h3>Translations</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {translations.map((t) => (
          <div key={t.id} className="group rounded-2xl bg-secondary/30 border-0 p-6 transition-colors hover:bg-secondary/60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-primary uppercase tracking-wider">{t.id}</span>
                <span className="text-xs text-muted-foreground">{t.name}</span>
              </div>
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-none bg-secondary/50 text-muted-foreground hover:text-primary transition-colors"
                title={`Read ${t.id} on Bible Gateway`}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="prose prose-sm prose-stone max-w-none">
              {t.text ? (
                <p className="text-sm font-serif leading-relaxed text-card-foreground">
                  {t.text}
                </p>
              ) : (
                <p className="text-sm italic text-muted-foreground bg-secondary/40 p-3 rounded-lg border-0">
                  Read the {t.id} translation of {reference} on Bible Gateway.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
