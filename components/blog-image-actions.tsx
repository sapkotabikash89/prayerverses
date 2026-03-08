'use client'

import { useState, useEffect } from 'react'
import { Heart, Facebook, Twitter, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface BlogImageActionsProps {
    slug: string
}

export function BlogImageActions({ slug }: BlogImageActionsProps) {
    const [loveCount, setLoveCount] = useState(16) // Default starting count
    const [hasLoved, setHasLoved] = useState(false)
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareText = typeof document !== 'undefined' ? document.title : ''

    useEffect(() => {
        const saved = localStorage.getItem(`love_${slug}`)
        if (saved === 'true') {
            setHasLoved(true)
            setLoveCount(prev => prev + 1)
        }
    }, [slug])

    const toggleLove = () => {
        if (hasLoved) {
            setHasLoved(false)
            setLoveCount(prev => prev - 1)
            localStorage.removeItem(`love_${slug}`)
        } else {
            setHasLoved(true)
            setLoveCount(prev => prev + 1)
            localStorage.setItem(`love_${slug}`, 'true')
            toast.success('Thank you for showing love!')
        }
    }

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
        <div className="flex items-center justify-between py-4 border-b border-border/50 mb-10">
            <Button
                variant="ghost"
                size="sm"
                className={`gap-2 px-0 hover:bg-transparent transition-colors ${hasLoved ? 'text-rose-500' : 'text-muted-foreground'}`}
                onClick={toggleLove}
            >
                <Heart className={`h-5 w-5 ${hasLoved ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">Show Love ({loveCount})</span>
            </Button>

            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Share</span>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                        onClick={shareOnFacebook}
                        aria-label="Share on Facebook"
                    >
                        <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                        onClick={shareOnTwitter}
                        aria-label="Share on X"
                    >
                        <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                        onClick={copyToClipboard}
                        aria-label="Copy link"
                    >
                        <LinkIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
