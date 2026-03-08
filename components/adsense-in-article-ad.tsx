"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function AdsenseInArticleAd() {
    const pathname = usePathname()

    useEffect(() => {
        try {
            // @ts-ignore
            ; (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (err) {
            console.error("AdSense error:", err)
        }
    }, [pathname])

    return (
        <div className="w-full my-8 flex flex-col items-center justify-center bg-secondary/10 border border-border/50 rounded-xl p-4 min-h-[250px] overflow-hidden relative z-10 clear-both">
            <span className="text-[10px] uppercase text-muted-foreground block mb-2 tracking-widest text-center w-full">Advertisement</span>
            <div className="w-full overflow-hidden flex justify-center">
                {/* New Vertical / Auto */}
                <ins
                    key={pathname}
                    className="adsbygoogle"
                    style={{ display: "block", minWidth: "300px", width: "100%" }}
                    data-ad-client="ca-pub-8258486511038311"
                    data-ad-slot="2247314683"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
            </div>
        </div>
    )
}
