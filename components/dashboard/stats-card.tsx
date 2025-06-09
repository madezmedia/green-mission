import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
}

export default function StatsCard({ title, value, change, icon: Icon }: StatsCardProps) {
  return (
    <Card className="border transition-all hover:shadow-md border-muted-foreground/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-3 w-3" />
          {change} vs last month
        </p>
      </CardContent>
    </Card>
  )
}
