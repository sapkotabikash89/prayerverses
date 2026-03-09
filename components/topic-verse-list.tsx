'use client'

import { useState } from 'react'
import { VerseCard } from '@/components/verse-card'
import { Button } from '@/components/ui/button'

interface Verse {
  text: string
  ref: string
}

interface TopicVerseListProps {
  initialVerses: Verse[]
  pageSize?: number
}

export function TopicVerseList({ initialVerses, pageSize = 20 }: TopicVerseListProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  
  const hasMore = visibleCount < initialVerses.length
  const currentVerses = initialVerses.slice(0, visibleCount)

  const loadMore = () => {
    setVisibleCount(prev => prev + pageSize)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {currentVerses.map((v, i) => (
          <VerseCard key={`${v.ref}-${i}`} text={v.text} reference={v.ref} />
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline" 
            onClick={loadMore}
            className="px-8 h-11 rounded-none border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            Load More Verses
          </Button>
        </div>
      )}
      
      {!hasMore && initialVerses.length > pageSize && (
        <p className="mt-8 text-center text-sm text-muted-foreground italic">
          You've viewed all {initialVerses.length} verses about this topic.
        </p>
      )}
    </div>
  )
}
