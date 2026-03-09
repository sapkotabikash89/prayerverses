'use client'

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { linkifyBibleVerses } from "@/lib/bible-links"

interface VerseMeaningProps {
  reference: string
  bookName: string
  chapter: number
  verse: number
  text: string
  bookSlug: string
  customMeaning?: string
  customContext?: string
  customChapterContext?: string
}

export function VerseMeaning({
  reference,
  bookName,
  chapter,
  verse,
  text,
  bookSlug,
  customMeaning,
  customContext,
  customChapterContext
}: VerseMeaningProps) {
  const [isMeaningCollapsed, setIsMeaningCollapsed] = useState(false)
  const [isContextCollapsed, setIsContextCollapsed] = useState(false)
  const [isChapterCollapsed, setIsChapterCollapsed] = useState(false)

  // Determine the general theme based on book slug
  const getTheme = () => {
    const law = ['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy']
    const history = ['joshua', 'judges', 'ruth', '1-samuel', '2-samuel', '1-kings', '2-kings', '1-chronicles', '2-chronicles', 'ezra', 'nehemiah', 'esther']
    const poetry = ['job', 'psalms', 'proverbs', 'ecclesiastes', 'song-of-solomon']
    const prophets = ['isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi']
    const gospels = ['matthew', 'mark', 'luke', 'john', 'acts']

    if (law.includes(bookSlug)) return 'foundation of God\'s covenant and the early history of His people'
    if (history.includes(bookSlug)) return 'historical account of God\'s faithfulness to Israel through their trials and triumphs'
    if (poetry.includes(bookSlug)) return 'wisdom, worship, and the expression of human emotion toward God'
    if (prophets.includes(bookSlug)) return 'prophetic call to repentance and the promise of future redemption'
    if (gospels.includes(bookSlug)) return 'life and teachings of Jesus Christ and the beginning of the early church'
    return 'unfolding narrative of God\'s plan for humanity and spiritual growth'
  }

  const theme = getTheme()

  const renderedMeaning = customMeaning ? linkifyBibleVerses(customMeaning) : null
  const renderedContext = customContext ? linkifyBibleVerses(customContext) : null
  const renderedChapterContext = customChapterContext ? linkifyBibleVerses(customChapterContext) : null

  return (
    <section className="mb-16">
      {/* What does it mean section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
          <h2 className="text-2xl font-serif font-bold text-card-foreground">
            What does {reference} mean?
          </h2>
          <button
            onClick={() => setIsMeaningCollapsed(!isMeaningCollapsed)}
            className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 uppercase tracking-wider transition-colors"
          >
            {isMeaningCollapsed ? (
              <><ChevronDown className="h-3 w-3" /> Expand</>
            ) : (
              <><ChevronUp className="h-3 w-3" /> Collapse</>
            )}
          </button>
        </div>

        {!isMeaningCollapsed && (
          <div className="prose prose-stone max-w-none dark:prose-invert text-muted-foreground space-y-6">
            {renderedMeaning ? (
              <div dangerouslySetInnerHTML={{ __html: renderedMeaning }} />
            ) : (
              <>
                <div dangerouslySetInnerHTML={{
                  __html: linkifyBibleVerses(`
                  In ${reference}, we encounter a pivotal moment within the larger narrative of ${bookName} Chapter ${chapter}. This verse speaks directly to the ${theme}, offering a profound insight into God's character and His divine will. When we examine the words &ldquo;<span className="text-card-foreground italic">${text}</span>,&rdquo; we see a clear call to trust in the sovereignty and timing of the Lord.
                `)
                }} />
                <div dangerouslySetInnerHTML={{
                  __html: linkifyBibleVerses(`
                  The preceding context often sets the stage for this specific truth. In the journey of faith, moments like the one described in ${reference} serve as milestones, reminding us that God's Word is not just a collection of historical records, but a living and active force. This verse encourages believers to look beyond their immediate circumstances and find peace in the eternal promises of Scripture.
                `)
                }} />
                <div dangerouslySetInnerHTML={{
                  __html: linkifyBibleVerses(`
                  God's commitment as shown here reveals His deep desire for a relationship with His people. While human nature remains prone to wandering, the truth of ${reference} stands as a testament to His unchanging grace. It invites us to meditate on how this specific revelation might reshape our thoughts, our priorities, and our daily walk with Christ.
                `)
                }} />
                <div dangerouslySetInnerHTML={{
                  __html: linkifyBibleVerses(`
                  Ultimately, we are meant to be comforted by the presence of God found in these words. They remind us that even in silence or struggle, the Creator is speaking, providing the exact spiritual nourishment we need for the season we are in.
                `)
                }} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Context Summary */}
      <div className="mb-10 p-8 rounded-none bg-secondary/20 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-bold text-card-foreground">
            Context Summary
          </h3>
          <button
            onClick={() => setIsContextCollapsed(!isContextCollapsed)}
            className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 uppercase tracking-wider transition-colors"
          >
            {isContextCollapsed ? (
              <><ChevronDown className="h-3 w-3" /> Expand</>
            ) : (
              <><ChevronUp className="h-3 w-3" /> Collapse</>
            )}
          </button>
        </div>

        {!isContextCollapsed && (
          <div className="prose prose-sm prose-stone max-w-none dark:prose-invert text-muted-foreground">
            {renderedContext ? (
              <div dangerouslySetInnerHTML={{ __html: renderedContext }} />
            ) : (
              <div dangerouslySetInnerHTML={{
                __html: linkifyBibleVerses(
                  `${reference} is situated within a crucial passage in ${bookName} ${chapter}. This section of Scripture focuses on the ${theme}. It provides the necessary backdrop for understanding how God interacts with His people and the world. By looking at the verses surrounding ${reference}, we see a consistent pattern of God's guidance, His requirement for faith, and His promise of redemption for those who follow Him.`
                )
              }} />
            )}
          </div>
        )}
      </div>

      {/* Chapter Context */}
      <div className="p-8 rounded-none bg-primary/5 border border-primary/10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-bold text-card-foreground">
            Chapter Context
          </h3>
          <button
            onClick={() => setIsChapterCollapsed(!isChapterCollapsed)}
            className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 uppercase tracking-wider transition-colors"
          >
            {isChapterCollapsed ? (
              <><ChevronDown className="h-3 w-3" /> Expand</>
            ) : (
              <><ChevronUp className="h-3 w-3" /> Collapse</>
            )}
          </button>
        </div>

        {!isChapterCollapsed && (
          <div className="prose prose-sm prose-stone max-w-none dark:prose-invert text-muted-foreground">
            {renderedChapterContext ? (
              <div dangerouslySetInnerHTML={{ __html: renderedChapterContext }} />
            ) : (
              <div dangerouslySetInnerHTML={{
                __html: linkifyBibleVerses(
                  `Throughout ${bookName} Chapter ${chapter}, we see the unfolding of ${theme}. The chapter highlights the importance of maintaining a steadfast heart and listening for the quiet nudge of the Holy Spirit. Even as challenges arise, the message remains clear: God is present, faithful, and actively speaking through His Word. This chapter encourages us to make time for Scripture, letting its truth light our path and strengthen our hearts for whatever lies ahead.`
                )
              }} />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
