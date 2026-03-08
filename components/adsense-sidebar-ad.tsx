"use client"

import { useEffect } from "react"

export function AdsenseSidebarAd() {
    useEffect(() => {
        try {
            // @ts-ignore
            ; (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (err) {
            console.error("AdSense error:", err)
        }
    }, [])

    return (
        <div className="sticky top-24 mt-12 w-full overflow-hidden bg-card/50 rounded-xl border border-border p-4 text-center">
            <span className="text-[10px] uppercase text-muted-foreground block mb-2 tracking-widest">Advertisement</span>
            {/* New Vertical */}
            <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-8258486511038311"
                data-ad-slot="2247314683"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    )
}
