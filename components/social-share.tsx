'use client'

import { Facebook, Twitter, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function SocialShare() {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareText = typeof document !== 'undefined' ? document.title : ''

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied to clipboard!')
    }

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    }

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
    }

    return (
        <div className="flex flex-col items-center py-10 border-t border-border">
            <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Share</span>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                        onClick={shareOnFacebook}
                        aria-label="Share on Facebook"
                    >
                        <Facebook className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                        onClick={shareOnTwitter}
                        aria-label="Share on X (Twitter)"
                    >
                        <Twitter className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                        onClick={copyToClipboard}
                        aria-label="Copy link"
                    >
                        <LinkIcon className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
