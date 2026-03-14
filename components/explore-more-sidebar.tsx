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
    const filteredItems = items.filter(item => !pathname.startsWith(item.href))

    // Also handle cases where pathname might be empty or "/"
    if (filteredItems.length === 0) return null

    return (
        <div className="space-y-6">
            <div className="bg-secondary/50 p-6 rounded-2xl border-0 shadow-sm">
                  <h2 className="text-xl font-bold font-serif mb-4 mt-0 text-card-foreground">
                      Explore More
                  </h2>

                <div className="space-y-1">
                    {filteredItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="group block p-3 rounded-lg hover:bg-white dark:hover:bg-card transition-all"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-md ${item.color} border-0 bg-opacity-50 group-hover:scale-105 transition-transform duration-300`}>
                                    {cloneElement(item.icon as React.ReactElement<any>, { className: "w-4 h-4" })}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="block font-bold text-[15px] mb-1 text-card-foreground group-hover:text-primary transition-colors">
                                        {item.title}
                                    </span>
                                    <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed m-0">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}
