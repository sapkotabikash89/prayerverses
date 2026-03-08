'use client'

import { useState, useCallback, useRef } from 'react'
import { Facebook, Twitter, Mail, Link as LinkIcon, RefreshCw, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { toPng } from 'html-to-image'

const BACKGROUNDS = [
  {
    id: 'sunrise',
    label: 'Sunrise',
    previewClass: 'bg-gradient-to-br from-amber-200 via-orange-100 to-rose-200',
    wrapperClass: 'bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100',
    textClass: 'text-orange-950',
    exportBg: '#fff7ed', // amber-50
  },
  {
    id: 'forest',
    label: 'Forest',
    previewClass: 'bg-gradient-to-br from-emerald-200 via-emerald-100 to-sky-200',
    wrapperClass: 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-sky-100',
    textClass: 'text-emerald-950',
    exportBg: '#ecfdf5', // emerald-50
  },
  {
    id: 'sky',
    label: 'Sky',
    previewClass: 'bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-200',
    wrapperClass: 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100',
    textClass: 'text-blue-950',
    exportBg: '#f0f9ff', // sky-50
  },
  {
    id: 'lavender',
    label: 'Lavender',
    previewClass: 'bg-gradient-to-br from-purple-200 via-fuchsia-100 to-pink-200',
    wrapperClass: 'bg-gradient-to-br from-purple-100 via-fuchsia-50 to-pink-100',
    textClass: 'text-purple-950',
    exportBg: '#f5f3ff', // purple-50
  },
  {
    id: 'dark',
    label: 'Dark',
    previewClass: 'bg-slate-900',
    wrapperClass: 'bg-slate-900 text-slate-50',
    textClass: 'text-slate-50',
    exportBg: '#0f172a', // slate-900
  }
]

interface Verse {
  text: string
  reference: string
}

interface RandomVerseClientProps {
  initialVerse: Verse
  allVerses: Verse[]
}

export function RandomVerseClient({ initialVerse, allVerses }: RandomVerseClientProps) {
  const [verse, setVerse] = useState(initialVerse)
  const [backgroundId, setBackgroundId] = useState('sunrise')
  const [isDownloading, setIsDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const selectedBackground = BACKGROUNDS.find(bg => bg.id === backgroundId) || BACKGROUNDS[0]

  const randomize = useCallback(() => {
    const next = allVerses[Math.floor(Math.random() * allVerses.length)]
    setVerse(next)
  }, [allVerses])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `"${verse.text}" - ${verse.reference}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
    toast.success('Copied to clipboard!')
  }

  const downloadImage = async () => {
    if (cardRef.current === null) return
    
    setIsDownloading(true)
    const toastId = toast.loading('Preparing your image...')

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: selectedBackground.exportBg,
        pixelRatio: 2,
      })
      
      const link = document.createElement('a')
      link.download = `random-bible-verse.png`
      link.href = dataUrl
      link.click()
      
      toast.success('Image downloaded!', { id: toastId })
    } catch (err) {
      console.error('Failed to download image', err)
      toast.error('Failed to download image', { id: toastId })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Randomize Button ABOVE the card */}
      <div className="mb-10">
        <Button 
          onClick={randomize} 
          size="lg"
          className="gap-2 px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <RefreshCw className="h-5 w-5" />
          Get Another Random Verse
        </Button>
      </div>

      {/* Hero Verse Card */}
      <div 
        ref={cardRef}
        className={`relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border/60 p-8 shadow-xl transition-all duration-500 lg:p-12 ${selectedBackground.wrapperClass}`}
      >
        <div className="flex flex-col items-center text-center">
          <blockquote className={`text-2xl font-serif leading-relaxed lg:text-3xl mb-6 ${selectedBackground.textClass}`}>
            &ldquo;{verse.text}&rdquo;
          </blockquote>
          <p className={`text-lg font-bold uppercase tracking-widest ${selectedBackground.textClass}`}>
            {verse.reference}
          </p>
          <div className="mt-8 flex items-center gap-2 opacity-50">
            <span className={`text-sm font-semibold tracking-tighter ${selectedBackground.textClass}`}>prayerverses.com</span>
          </div>
        </div>
      </div>

      {/* Social Sharing & Actions */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}>
          <Facebook className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}>
          <Twitter className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open(`mailto:?subject=Random Bible Verse&body=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank')}>
          <Mail className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={copyToClipboard} title="Copy Verse Text">
            <LinkIcon className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full" 
            onClick={downloadImage} 
            disabled={isDownloading}
            title="Download as Image"
          >
            <Download className={`h-5 w-5 ${isDownloading ? 'animate-pulse' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Background Selector */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Choose Background</p>
        <div className="flex gap-3">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              onClick={() => setBackgroundId(bg.id)}
              className={`group relative h-10 w-10 rounded-full border-2 transition-all ${
                backgroundId === bg.id ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent hover:scale-105'
              } ${bg.previewClass}`}
              title={bg.label}
            >
              <span className="sr-only">{bg.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
