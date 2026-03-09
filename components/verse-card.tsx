"use client"

import Link from "next/link"
import { useState } from "react"
import { Copy, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { referenceToChapterHref } from "@/data/bible"

interface VerseCardProps {
  text: string
  reference: string
  className?: string
}

export function VerseCard({ text, reference, className = "" }: VerseCardProps) {
  const [copied, setCopied] = useState(false)
  const verseHref = referenceToChapterHref(reference)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`"${text}" - ${reference}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: reference,
        text: `"${text}" - ${reference}`,
      })
    } else {
      handleCopy()
    }
  }

  return (
    <div
      className={`bg-card border border-border rounded-none p-6 ${className}`}
    >
      <blockquote className="text-lg font-serif leading-relaxed text-card-foreground mb-3">
        &ldquo;{text}&rdquo;
      </blockquote>
      <p className="text-sm font-semibold text-primary mb-4">
        &mdash;{" "}
        {verseHref ? (
          <Link href={verseHref} className="">
            {reference}
          </Link>
        ) : (
          reference
        )}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </div>
    </div>
  )
}
