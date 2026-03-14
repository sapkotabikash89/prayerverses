import { TopicIcon } from "@/components/topic-icon"
import { Category } from "@/lib/wordpress"

export function TopicGrid({ categories = [] }: { categories?: Category[] }) {
  return (
    <section className="py-10 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-serif mb-2 mt-0 text-card-foreground">
            Explore by Category
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Browse our collection of blog posts and spiritual insights organized
            by categories to help you grow in your faith.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-3 md:gap-4">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.slug}/`}
              className="group flex flex-col items-center gap-3 rounded-lg bg-secondary/30 p-4 sm:p-5 text-center transition-colors hover:bg-secondary/60 sm:min-w-[140px]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <TopicIcon name="BookOpen" className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-card-foreground">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
