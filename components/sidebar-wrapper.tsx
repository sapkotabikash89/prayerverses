"use client"

import { usePathname } from "next/navigation"
import { ExploreMoreSidebar } from "./explore-more-sidebar"
import { AdsenseSidebarAd } from "./adsense-sidebar-ad"

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Sidebar is now global, including homepage
    const shouldShowSidebar = true

    if (!shouldShowSidebar) {
        return <>{children}</>
    }

    return (
        <div className="mx-auto max-w-[1200px] px-2 py-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    {children}
                </div>
                <aside className="lg:col-span-4 hidden lg:block">
                    <ExploreMoreSidebar />
                    <AdsenseSidebarAd />
                </aside>
            </div>

            {/* Mobile-only sidebar: appears below content */}
            <aside className="lg:hidden mt-12 border-t border-border pt-8 space-y-8">
                <ExploreMoreSidebar />
                <AdsenseSidebarAd />
            </aside>
        </div>
    )
}
