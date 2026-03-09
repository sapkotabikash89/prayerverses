"use client"

import { usePathname } from "next/navigation"
import { cloneElement } from "react"
import { ArrowRight, BookOpen, Shuffle, Calendar } from "lucide-react"

export function ExploreMoreSidebar() {
    const pathname = usePathname()

    const items = [
        {
            title: "Verse of the Day",
            href: "/verse-of-the-day/",
            description: "Daily spiritual inspiration and prayers for your journey.",
            icon: <Calendar className="w-5 h-5" />,
            color: "text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400",
        },
        {
            title: "Random Verse",
            href: "/random-verse/",
            description: "Discover hidden gems and encouraging words from Scripture.",
            icon: <Shuffle className="w-5 h-5" />,
            color: "text-purple-600 bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400",
        },
        {
            title: "Books of the Bible",
            href: "/books-of-the-bible/",
            description: "Complete guide to all 66 books from Genesis to Revelation.",
            icon: <BookOpen className="w-5 h-5" />,
            color: "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400",
        },
    ]

    // Filter out the current page
    const filteredItems = items.filter(item => pathname === item.href || pathname.startsWith(item.href) ? false : true)

    // Also handle cases where pathname might be empty or "/"
    if (filteredItems.length === 0) return null

    return (
        <div className="space-y-6">
            <section className="bg-card border border-border rounded-none p-6 shadow-sm overflow-hidden">
                <h2 className="text-lg font-serif font-bold text-card-foreground mb-4 flex items-center gap-3">
                    <span className="w-7 h-7 rounded-none bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                    </span>
                    Explore More
                </h2>

                <div className="space-y-3">
                    {filteredItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="group block p-3.5 rounded-none border border-border hover:border-primary/30 hover:shadow-md transition-all bg-background relative overflow-hidden"
                        >
                            <div className="flex items-start gap-3 relative z-10">
                                <div className={`p-2 rounded-none border ${item.color} group-hover:scale-105 transition-transform duration-300`}>
                                    {cloneElement(item.icon as React.ReactElement<any>, { className: "w-4 h-4" })}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-card-foreground group-hover:text-primary transition-colors leading-tight mb-0.5">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                                <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-1 hidden sm:block" />
                            </div>

                            {/* Subtle hover background effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    ))}
                </div>
            </section>
        </div>
    )
}
