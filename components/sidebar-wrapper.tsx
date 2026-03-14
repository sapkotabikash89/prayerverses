"use client"

import { usePathname } from "next/navigation"
import { ExploreMoreSidebar } from "./explore-more-sidebar"

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Sidebar is now global, including homepage
    const shouldShowSidebar = true

    if (!shouldShowSidebar) {
        return <>{children}</>
    }

    return (
        <div className="mx-auto max-w-[1200px] px-2 lg:px-6 site-container">
            <div className="flex flex-col lg:flex-row gap-8 pt-4">
                <main className="flex-1 min-w-0 mv-content-body">
                    {children}
                </main>

                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-[300px] flex-shrink-0 sidebar">
                    <div className="space-y-8">
                        <ExploreMoreSidebar />
                    </div>
                </aside>

                {/* Mobile Sidebar - below content */}
                <aside className="lg:hidden mt-12 pt-12 border-t border-border sidebar">
                    <div className="space-y-8">
                        <ExploreMoreSidebar />
                    </div>
                </aside>
            </div>
        </div>
    )
}
