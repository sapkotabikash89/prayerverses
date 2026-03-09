"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function AdsenseSidebarAd() {
    const pathname = usePathname()

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            try {
                // @ts-ignore
                ; (window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (err) {
                console.error("AdSense error:", err)
            }
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [pathname])

    return (
        <div className="sticky top-24 mt-12 w-full overflow-hidden bg-card/50 rounded-none border border-border p-4 text-center relative z-10 clear-both">
            <span className="text-[10px] uppercase text-muted-foreground block mb-2 tracking-widest">Advertisement</span>
            {/* New Vertical */}
            <ins
                key={pathname}
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-8258486511038311"
                data-ad-slot="2247314683"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    )
}
