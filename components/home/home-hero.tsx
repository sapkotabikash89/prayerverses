"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Sparkles } from "lucide-react"

export function HomeHero() {
    return (
        <section className="relative h-[500px] w-full overflow-hidden rounded-3xl mb-12">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/hero-background.png')" }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center px-6 lg:px-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground text-xs font-bold uppercase tracking-widest mb-6">
                    <Sparkles className="h-3 w-3" />
                    <span>Welcome to PrayerVerses</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
                    Connect with God Through <br className="hidden md:block" />
                    <span className="text-primary-foreground">Daily Inspiration</span>
                </h1>

                <p className="max-w-2xl text-lg text-white/90 mb-10 leading-relaxed font-medium drop-shadow-md">
                    Explore powerful Bible verses, read uplifting stories, and find spiritual guidance
                    for your daily walk with Christ.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link href="/verse-of-the-day/">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 rounded-full shadow-lg transition-all hover:scale-105">
                            Read Today&apos;s Verse
                        </Button>
                    </Link>
                    <Link href="/books-of-the-bible/">
                        <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md font-bold px-8 rounded-full shadow-lg transition-all hover:scale-105">
                            <BookOpen className="mr-2 h-5 w-5" />
                            Explore the Bible
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
