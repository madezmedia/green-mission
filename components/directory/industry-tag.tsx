import { Building } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface IndustryTagProps {
  category: string
  icon?: "building"
  position?: "after-member-since" | "standalone"
  className?: string
}

export default function IndustryTag({ 
  category, 
  icon = "building", 
  position = "standalone",
  className 
}: IndustryTagProps) {
  const IconComponent = Building

  if (position === "after-member-since") {
    return (
      <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", className)}>
        <IconComponent className="h-3 w-3" />
        <span>{category}</span>
      </div>
    )
  }

  return (
    <Badge 
      variant="secondary" 
      className={cn("text-xs", className)}
    >
      <IconComponent className="mr-1 h-3 w-3" />
      {category}
    </Badge>
  )
}