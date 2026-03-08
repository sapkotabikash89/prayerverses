import Link from "next/link"
import { Calendar, Shuffle, Book, LayoutGrid, Newspaper } from "lucide-react"

const ACTIONS = [
    {
        title: "Verse of the Day",
        description: "Start your morning with a hand-picked promise from God.",
        href: "/verse-of-the-day/",
        icon: Calendar,
        color: "bg-amber-50 text-amber-600",
        iconBg: "bg-amber-100",
    },
    {
        title: "Random Verse",
        description: "Let the Spirit guide you to a surprising piece of wisdom.",
        href: "/random-verse/",
        icon: Shuffle,
        color: "bg-rose-50 text-rose-600",
        iconBg: "bg-rose-100",
    },
    {
        title: "Bible Books",
        description: "Explore the Old and New Testaments chapter by chapter.",
        href: "/books-of-the-bible/",
        icon: Book,
        color: "bg-emerald-50 text-emerald-600",
        iconBg: "bg-emerald-100",
    },
    {
        title: "Topical verses",
        description: "Find strength for specific life situations and emotions.",
        href: "/#categories",
        icon: LayoutGrid,
        color: "bg-sky-50 text-sky-600",
        iconBg: "bg-sky-100",
    }
]

export function QuickAccessGrid() {
    return (
        <section className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ACTIONS.map((action) => (
                    <Link
                        key={action.title}
                        href={action.href}
                        className={`group block p-6 rounded-2xl border border-border bg-card transition-all hover:shadow-md hover:-translate-y-1`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${action.iconBg} ${action.color.split(' ')[1]} transition-colors group-hover:bg-primary group-hover:text-primary-foreground`}>
                                <action.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-card-foreground mb-1">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {action.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
