import { Badge } from "@/components/ui/badge"
import { Star, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface MemberTagProps {
  type: "Featured Member" | "Member"
  color?: "green-accent" | "green-base"
  icon?: "star" | "check"
  className?: string
}

export default function MemberTag({ 
  type, 
  color = type === "Featured Member" ? "green-accent" : "green-base",
  icon = type === "Featured Member" ? "star" : "check",
  className 
}: MemberTagProps) {
  const colorClasses = {
    "green-accent": "bg-accent text-accent-foreground hover:bg-accent/90",
    "green-base": "bg-primary/10 text-primary border-primary/20"
  }

  const IconComponent = icon === "star" ? Star : Check

  return (
    <Badge 
      className={cn(
        colorClasses[color],
        "shadow-sm",
        className
      )}
      variant={color === "green-base" ? "outline" : "default"}
    >
      <IconComponent className="mr-1 h-3 w-3" />
      {type}
    </Badge>
  )
}