import {
  Heart,
  Flame,
  Sun,
  Shield,
  Leaf,
  Hand,
  HeartHandshake,
  Gift,
  BookOpen,
  Plus,
  CloudSun,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Flame,
  Sun,
  Shield,
  Leaf,
  HandMetal: Hand,
  HeartHandshake,
  Gift,
  BookOpen,
  Cross: Plus,
  CloudSun,
  Sparkles,
}

interface TopicIconProps {
  name: string
  className?: string
}

export function TopicIcon({ name, className = "h-5 w-5" }: TopicIconProps) {
  const Icon = iconMap[name] || BookOpen
  return <Icon className={className} />
}
