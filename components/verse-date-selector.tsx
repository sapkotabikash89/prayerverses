'use client'

import { useRouter } from 'next/navigation'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import Link from 'next/link'

interface VerseDateSelectorProps {
  currentDate: string
  allDates: string[]
}

export function VerseDateSelector({ currentDate, allDates }: VerseDateSelectorProps) {
  const router = useRouter()
  const todayIdx = allDates.indexOf(currentDate)
  const prevDate = todayIdx > 0 ? allDates[todayIdx - 1] : null
  const nextDate = todayIdx < allDates.length - 1 ? allDates[todayIdx + 1] : null

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Use local date methods to avoid timezone shift issues with toISOString()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const iso = `${year}-${month}-${day}`
      router.push(`/verse-of-the-day/${iso}/`)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {prevDate && (
        <Link 
          href={`/verse-of-the-day/${prevDate}/`} 
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          title="Previous Day"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
      )}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 px-6 h-11 rounded-full shadow-sm hover:shadow-md transition-all">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span className="font-medium">{currentDate}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="center">
          <Calendar
            mode="single"
            selected={new Date(currentDate + "T12:00:00")}
            onSelect={handleDateSelect}
            disabled={(date) => date > new Date() || date < new Date(allDates[0] + "T12:00:00")}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {nextDate && (
        <Link 
          href={`/verse-of-the-day/${nextDate}/`} 
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          title="Next Day"
        >
          <ChevronRight className="h-6 w-6" />
        </Link>
      )}
    </div>
  )
}
