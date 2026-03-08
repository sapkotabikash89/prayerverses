import type { Metadata, Viewport } from "next"
import { Lora, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import "./globals.css"

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "PrayerVerses - Daily Bible Verses & Spiritual Inspiration",
    template: "%s | PrayerVerses",
  },
  description:
    "Discover daily Bible verses, read Scripture by topic, and deepen your faith with beautiful verse cards.",
  metadataBase: new URL("https://prayerverses.com"),
  robots: { index: true, follow: true },
  icons: {
    icon: "/prayer-verses-logo.webp",
    apple: "/prayer-verses-logo.webp",
  },
  openGraph: {
    type: "website",
    siteName: "PrayerVerses",
    title: "PrayerVerses - Daily Bible Verses & Spiritual Inspiration",
    description:
      "Discover daily Bible verses, read Scripture by topic, and deepen your faith.",
    images: [{ url: "/prayer-verses-logo.webp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrayerVerses",
    description:
      "Daily Bible verses, topical scripture, and spiritual inspiration.",
    images: ["/prayer-verses-logo.webp"],
  },
}

export const viewport: Viewport = {
  themeColor: "#8B5E3C",
  width: "device-width",
  initialScale: 1,
}

import { getCategories } from "@/lib/wordpress"
import { SidebarWrapper } from "@/components/sidebar-wrapper"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const categories = await getCategories()

  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <SiteHeader categories={categories} />
        <main className="flex-1">
          <SidebarWrapper>
            {children}
          </SidebarWrapper>
        </main>
        <SiteFooter categories={categories} />
        <Analytics />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0YB78XGFK9"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0YB78XGFK9');
          `}
        </Script>

        {/* Mediavine Grow — ads loader */}
        <Script
          src="//scripts.scriptwrapper.com/tags/1ea9a248-74ed-44aa-821d-989e148cc551.js"
          strategy="lazyOnload"
          data-noptimize="1"
          data-cfasync="false"
        />

        {/* Mediavine Grow — initializer */}
        <Script id="grow-initializer" strategy="lazyOnload">
          {`
            !(function(){
              window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),
              (window.growMe._=[]));
              var e=document.createElement("script");
              e.type="text/javascript";
              e.src="https://faves.grow.me/main.js";
              e.defer=true;
              e.setAttribute("data-grow-faves-site-id","U2l0ZToxZWE5YTI0OC03NGVkLTQ0YWEtODIxZC05ODllMTQ4Y2M1NTE=");
              var t=document.getElementsByTagName("script")[0];
              t.parentNode.insertBefore(e,t);
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
