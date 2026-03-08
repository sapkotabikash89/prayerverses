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
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    {children}
                </div>
                <aside className="lg:col-span-4 hidden lg:block">
                    <ExploreMoreSidebar />
                </aside>
            </div>

            {/* Mobile-only sidebar: appears below content */}
            <aside className="lg:hidden mt-16 border-t border-border pt-12">
                <ExploreMoreSidebar />
            </aside>
        </div>
    )
}
