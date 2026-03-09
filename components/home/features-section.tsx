import { Calendar, Search, ImageIcon, LockOpen } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Daily Verses",
    description:
      "Receive a fresh Bible verse every day to inspire and guide your spiritual walk.",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Find any verse instantly by topic, reference, or keyword with our powerful search.",
  },
  {
    icon: ImageIcon,
    title: "Beautiful Cards",
    description:
      "Create and download stunning verse cards with custom backgrounds and fonts.",
  },
  {
    icon: LockOpen,
    title: "Free Access",
    description:
      "All features are completely free. No accounts, no ads, no limitations.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-serif font-bold text-card-foreground lg:text-3xl text-balance">
            Everything You Need for Daily Scripture
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            PrayerVerses brings the Bible to your fingertips with tools designed
            to enrich your daily devotion.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center rounded-none border border-border bg-card p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary mb-4">
                <feature.icon className="h-6 w-6" />
              </span>
              <h3 className="text-base font-semibold text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
