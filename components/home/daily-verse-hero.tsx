"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { VerseCard } from "@/components/verse-card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import versesData from "@/data/verses.json"
import { getVersesForReference } from "@/lib/bible-text"

const BACKGROUNDS = [
  {
    id: "sunrise",
    label: "Sunrise",
    previewClass: "bg-gradient-to-br from-amber-200 via-orange-100 to-rose-200",
    wrapperClass: "bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100",
  },
  {
    id: "forest",
    label: "Forest",
    previewClass: "bg-gradient-to-br from-emerald-200 via-emerald-100 to-sky-200",
    wrapperClass: "bg-gradient-to-br from-emerald-100 via-emerald-50 to-sky-100",
  },
  {
    id: "evening",
    label: "Evening",
    previewClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900",
    wrapperClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900",
  },
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00")
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function getDateStr(offset: number, base: string) {
  const d = new Date(base + "T12:00:00")
  d.setDate(d.getDate() + offset)
  return d.toISOString().split("T")[0]
}

export function DailyVerseHero() {
  const todayStr = useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
  }, [])

  const verses = versesData as Record<string, { text: string; ref: string }>
  const allDates = useMemo(() => Object.keys(verses).sort(), [verses])
  const firstDate = allDates[0]
  const lastDate = allDates[allDates.length - 1]

  const [currentDate, setCurrentDate] = useState(todayStr)
  const [backgroundId, setBackgroundId] = useState<string>("sunrise")
  const [displayVerse, setDisplayVerse] = useState<{ text: string, ref: string } | null>(null)
  const verse = verses[currentDate]

  useEffect(() => {
    async function loadRealVerse() {
      if (verse) {
        const realVerses = await getVersesForReference(verse.ref)
        if (realVerses && realVerses.length > 0) {
          setDisplayVerse({
            text: realVerses.map(rv => rv.text).join(" "),
            ref: verse.ref
          })
        } else {
          setDisplayVerse(verse)
        }
      } else {
        setDisplayVerse(null)
      }
    }
    loadRealVerse()
  }, [verse])

  const goPrev = () => setCurrentDate((d) => getDateStr(-1, d))
  const goNext = () => setCurrentDate((d) => getDateStr(1, d))

  const selectedBackground =
    BACKGROUNDS.find((bg) => bg.id === backgroundId) ?? BACKGROUNDS[0]

  const currentDateObj = useMemo(
    () => new Date(currentDate + "T12:00:00"),
    [currentDate],
  )

  const fromDate = firstDate ? new Date(firstDate + "T12:00:00") : undefined
  const toDate = lastDate ? new Date(lastDate + "T12:00:00") : undefined

  return (
    <section className="relative overflow-hidden bg-secondary py-16 lg:py-24">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--accent)_0%,_transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center lg:px-8">
        <h1 className="mb-3 text-3xl font-serif font-bold text-balance text-card-foreground lg:text-4xl">
          Find Inspiration in God&apos;s Word
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Discover daily Bible verses, search Scripture by topic, and strengthen your faith with beautiful, shareable verse cards.
        </p>

        <div className="mb-4 flex items-center justify-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            Today&apos;s Bible Verse of the Day (KJV)
          </span>
        </div>
        <p className="mb-6 text-sm font-medium text-secondary-foreground">
          {formatDate(currentDate)}
        </p>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={goPrev}
              aria-label="Previous day"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goNext}
              aria-label="Next day"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {fromDate && toDate && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="inline-flex items-center gap-2 text-sm"
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span>Choose Date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-3" align="center">
                <Calendar
                  mode="single"
                  selected={currentDateObj}
                  onSelect={(date) => {
                    if (!date) return
                    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                    setCurrentDate(iso)
                  }}
                  fromDate={fromDate}
                  toDate={toDate}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {displayVerse ? (
          <div
            className={`relative mx-auto max-w-xl overflow-hidden rounded-none border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm ${selectedBackground.wrapperClass}`}
          >
            <div className="relative">
              <VerseCard
                text={displayVerse.text}
                reference={displayVerse.ref}
                className="bg-transparent border-none p-6 text-left sm:p-8"
              />
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-secondary-foreground/70">
                prayerverses.com
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-secondary-foreground">
                Choose a background style for this verse card.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-secondary-foreground">
                  Choose Background
                </span>
                <div className="flex gap-1.5">
                  {BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setBackgroundId(bg.id)}
                      aria-label={bg.label}
                      aria-pressed={backgroundId === bg.id}
                      className={`h-7 w-7 rounded-none border border-border/60 ring-offset-2 transition hover:scale-105 ${bg.previewClass} ${backgroundId === bg.id
                          ? "ring-2 ring-primary"
                          : "ring-0"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-none p-6">
            <p className="text-muted-foreground font-serif italic">
              No verse available for this date yet. Check back soon.
            </p>
          </div>
        )}

        <div className="mt-8">
          <Link href="/verse-of-the-day/">
            <Button
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              View All Daily Verses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
