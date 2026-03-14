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
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-serif mb-2 mt-0 text-card-foreground">
                    Quick Access
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                    Jump directly to key sections of our website.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ACTIONS.map((action) => (
                    <a
                        key={action.title}
                        href={action.href}
                        className={`group block p-6 rounded-xl bg-secondary/30 transition-colors hover:bg-secondary/60`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${action.iconBg} ${action.color.split(' ')[1]} transition-colors group-hover:bg-primary group-hover:text-primary-foreground`}>
                                <action.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold font-serif mt-0 mb-1 text-card-foreground">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed m-0">
                                    {action.description}
                                </p>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    )
}
