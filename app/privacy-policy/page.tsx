import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "PrayerVerses privacy policy. Learn how we handle your data and protect your privacy.",
  keywords: ["privacy policy", "data protection", "prayerverses privacy", "user data", "cookie policy", "privacy information", "christian website privacy", "legal privacy", "security", "data handling"],
  openGraph: {
    title: "Privacy Policy",
    description: "PrayerVerses privacy policy. Learn how we handle your data and protect your privacy.",
    type: "website",
  },
  alternates: { canonical: "https://prayerverses.com/privacy-policy/" },
  robots: { index: true, follow: true },
}

export default function PrivacyPolicyPage() {
  return (
    <article className="post-content">
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-10">
        <Breadcrumb items={[{ label: "Privacy Policy", href: "/privacy-policy/" }]} />
        <h1 className="text-3xl font-serif font-bold text-card-foreground mb-6 lg:text-4xl">
          Privacy Policy
        </h1>
        <div className="flex flex-col gap-8 text-base leading-relaxed text-card-foreground">
          <div className="space-y-1 text-sm text-muted-foreground bg-secondary/30 p-4 rounded-none border border-border">
            <p>Effective Date: March 8, 2026</p>
            <p>Website: https://prayerverses.com</p>
            <p>Contact Email: info@prayerverses.com</p>
          </div>

          <p>At Prayer Verses, we take your privacy seriously. This page explains what data we collect, how we use it, and what rights you have as a visitor to our site. We aim to be transparent and respectful of your personal information.</p>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect two types of data:</p>
            <ul className="list-disc list-inside space-y-4">
              <li><strong>Information you provide directly:</strong> If you contact us by email, we may collect your name, email address, and your message. This is only used to respond to your inquiry.</li>
              <li>
                <strong>Information collected automatically:</strong> When you visit the website, we may collect data like:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Your IP address</li>
                  <li>Browser type</li>
                  <li>Device used</li>
                  <li>Pages you visited</li>
                  <li>Time spent on the site</li>
                  <li>Search terms used on the site</li>
                </ul>
              </li>
            </ul>
            <p className="mt-4">This data is anonymous and used to improve how the site functions and performs.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use your data for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>To reply to emails you send us</li>
              <li>To understand how visitors use our site</li>
              <li>To fix errors, improve content, and make our website easier to use</li>
              <li>To prevent spam, abuse, or technical issues</li>
            </ul>
            <p className="mt-4">We do not use your data to track you across the web. We also do not sell or trade your data to any third party.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">3. Cookies Policy</h2>
            <p>Cookies are small files saved in your browser. We use cookies to:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Remember your preferences (like dark mode, if available)</li>
              <li>Understand which pages are most visited</li>
              <li>Help us make the site easier to navigate</li>
            </ul>
            <p className="mt-4">You can disable cookies from your browser settings. However, some features may not work properly if cookies are blocked.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">4. Google Analytics</h2>
            <p>We use Google Analytics to gather general statistics, such as:</p>
            <ul className="list-disc list-inside mt-4 space-y-2 mb-4">
              <li>How many visitors come to the site</li>
              <li>What pages are most viewed</li>
              <li>Where visitors come from (country or device type)</li>
            </ul>
            <p>Google Analytics uses its own cookies. All the data is anonymous and helps us improve our content. You can opt out of Google Analytics tracking using this tool:</p>
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-primary font-bold hover:underline">
              🔗 Google Analytics Opt-Out Add-on
            </a>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">5. Disclosure and Sharing of Information</h2>
            <p className="mb-4">We may share your information only in the following situations:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>To comply with legal requirements (like a court order or investigation)</li>
              <li>To protect the rights, safety, or security of our website or users</li>
              <li>With trusted service providers (like Google) that help us run the site, under strict privacy agreements</li>
            </ul>
            <p className="mt-4 italic">We never sell your personal data.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">6. Security Measures</h2>
            <p>Our website uses an SSL certificate, which means all data shared between your browser and our server is encrypted using HTTPS. This helps protect your data while it&apos;s being transmitted.</p>
            <p className="mt-4 text-muted-foreground">While we use industry-standard methods to protect your information, no website is completely risk-free. We do our best to keep your data safe and secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">7. External Links</h2>
            <p>Our pages may include links to other helpful websites. Please note:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>We do not control the privacy practices of those third-party sites.</li>
              <li>You should read their privacy policies before providing any personal information.</li>
            </ul>
            <p className="mt-4">We link to these sites for additional reading or trusted resources, but we are not responsible for how those sites operate.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">8. Bible Content Licensing</h2>
            <p>All Bible verses used on Prayer Verses are taken from the King James Version (KJV), which is in the public domain and free to use worldwide. This version does not require a license for online sharing or publication.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">9. GDPR Compliance (For EU Users)</h2>
            <p>If you live in the European Union (EU) or European Economic Area (EEA), the General Data Protection Regulation (GDPR) gives you these rights:</p>
            <ul className="list-disc list-inside mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
              <li>• Access Your Data</li>
              <li>• Correction of Data</li>
              <li>• Deletion (Right to be Forgotten)</li>
              <li>• Restriction of Processing</li>
              <li>• Objection to Processing</li>
              <li>• Data Portability</li>
            </ul>
            <p className="mt-6">To request any of the above, email us at <a href="mailto:info@prayerverses.com" className="text-primary hover:underline">info@prayerverses.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">10. Children&apos;s Privacy</h2>
            <p>Our website is intended for a general audience and is not meant for children under 13 years old. We do not knowingly collect personal data from children. If you believe a child has submitted personal info to us, please email us so we can delete it immediately.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-card-foreground mb-4">11. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy or your personal data, feel free to reach out:</p>
            <p className="mt-4 font-bold">📧 Email: info@prayerverses.com</p>
            <p className="font-bold text-primary">🌐 Website: https://prayerverses.com</p>
          </section>
        </div>
      </div>
    </article>
  )
}
