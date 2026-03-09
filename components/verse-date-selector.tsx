'use client'

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

interface VerseDateSelectorProps {
  currentDate: string
  allDates: string[]
}

export function VerseDateSelector({ currentDate, allDates }: VerseDateSelectorProps) {
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
      window.location.href = `/verse-of-the-day/${iso}/`
    }
  }

  return (
    <div className="flex items-center gap-4">
      {prevDate && (
        <a
          href={`/verse-of-the-day/${prevDate}/`}
          className="p-2 rounded-none hover:bg-secondary transition-colors"
          title="Previous Day"
        >
          <ChevronLeft className="h-6 w-6" />
        </a>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 px-6 h-11 rounded-none shadow-sm hover:shadow-md transition-all">
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
        <a
          href={`/verse-of-the-day/${nextDate}/`}
          className="p-2 rounded-none hover:bg-secondary transition-colors"
          title="Next Day"
        >
          <ChevronRight className="h-6 w-6" />
        </a>
      )}
    </div>
  )
}
