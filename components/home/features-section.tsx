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
    <section className="py-10 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-10 lg:mb-16">
          <h2>
            A Hub for Spiritual Growth
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
              className="flex flex-col items-center text-center rounded-2xl bg-secondary/30 border-0 p-8 transition-colors hover:bg-secondary/50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary mb-4">
                <feature.icon className="h-6 w-6" />
              </span>
              <h3>
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
