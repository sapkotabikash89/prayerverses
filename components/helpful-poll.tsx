'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function HelpfulPoll() {
    const [voted, setVoted] = useState(false)

    const handleVote = (useful: boolean) => {
        setVoted(true)
        toast.success('Thank you for your feedback!')
        // In a real app, you would send this to an analytics or feedback API
    }

    if (voted) {
        return (
            <div className="flex flex-col items-center py-8 border-t border-border">
                <h3 className="text-xl font-serif font-bold text-card-foreground mb-4">Thank you for your feedback!</h3>
                <p className="text-muted-foreground text-sm">We're glad you found this helpful.</p>
            </div>
        )
    }

    return (
        <div className="my-8 rounded-none border border-border bg-secondary/30 p-6 text-center">
            <h4 className="mb-2 font-bold">Was this page helpful?</h4>
            <div className="mt-4 flex items-center justify-center gap-4">
                <Button
                    variant="outline"
                    className="flex items-center gap-2 px-6 h-11 rounded-none bg-card hover:bg-secondary transition-all"
                    onClick={() => handleVote(true)}
                >
                    <ThumbsUp className="h-4 w-4" />
                    Yes
                </Button>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 px-6 h-11 rounded-none bg-card hover:bg-secondary transition-all"
                    onClick={() => handleVote(false)}
                >
                    <ThumbsDown className="h-4 w-4" />
                    No
                </Button>
            </div>
        </div>
    )
}
