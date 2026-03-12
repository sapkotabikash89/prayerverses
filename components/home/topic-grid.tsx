import { TopicIcon } from "@/components/topic-icon"
import { Category } from "@/lib/wordpress"

export function TopicGrid({ categories = [] }: { categories?: Category[] }) {
  return (
    <section className="py-10 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-serif font-bold text-card-foreground lg:text-3xl text-balance">
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
              className="group flex flex-col items-center gap-2 rounded-none border border-border bg-card p-3 sm:p-5 text-center transition-all hover:border-primary/30 hover:shadow-md sm:min-w-[140px]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-none bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <TopicIcon name="BookOpen" className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-card-foreground">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
