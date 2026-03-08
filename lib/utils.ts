import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getReadingTime(html: string): number {
  if (!html) return 0;
  const wordsPerMinute = 200;
  const text = html.replace(/<[^>]*>/g, ''); // Simple strip tags
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
