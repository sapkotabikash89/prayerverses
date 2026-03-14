import { getNewestPosts } from "@/lib/wordpress"
import { BlogPostCard } from "@/components/blog-post-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export async function LatestPostsSection() {
    const { nodes: posts } = await getNewestPosts(3)

    if (!posts || posts.length === 0) return null

    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold font-serif mb-0 mt-0 text-card-foreground">
                        Latest Posts
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Read our latest blog posts and grow in your spiritual journey.
                    </p>
                </div>
                <a href="https://prayerverses.com/category/blog/" className="hidden sm:block">
                    <Button variant="ghost" className="text-primary font-bold hover:text-primary/80">
                        View All Posts <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
                <a href="https://prayerverses.com/category/blog/">
                    <Button variant="outline" className="w-full border-primary text-primary font-bold">
                        View All Posts
                    </Button>
                </a>
            </div>
        </section>
    )
}
