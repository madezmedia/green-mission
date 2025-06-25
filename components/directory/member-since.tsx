import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface MemberSinceProps {
  date: string
  icon?: "calendar"
  format?: "Month YYYY" | "full"
  className?: string
}

export default function MemberSince({ 
  date, 
  icon = "calendar", 
  format = "Month YYYY",
  className 
}: MemberSinceProps) {
  const formatDate = (dateString: string) => {
    try {
      const parsedDate = new Date(dateString)
      if (format === "Month YYYY") {
        return parsedDate.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        })
      }
      return parsedDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return "Unknown"
    }
  }

  const IconComponent = Calendar

  return (
    <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <IconComponent className="h-3 w-3" />
      <span>Member since {formatDate(date)}</span>
    </div>
  )
}