import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import StatsCard from "./stats-card"
import { Users, Building, Award, BarChart3 } from "lucide-react"
import { sampleMembers } from "@/lib/data"
import MemberCard from "../directory/member-card"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back! 👋</h1>
        <p className="text-muted-foreground">Here's what's happening in your sustainable business network.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Network Connections" value="1,247" change="+12.5%" icon={Users} />
        <StatsCard title="Business Views" value="3,892" change="+8.2%" icon={Building} />
        <StatsCard title="Sustainability Score" value="89%" change="+3.1%" icon={Award} />
        <StatsCard title="Engagement Rate" value="24.6%" change="+15.7%" icon={BarChart3} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured Businesses</h2>
          <Button variant="ghost" className="text-primary">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {sampleMembers
            .filter((m) => m.featured)
            .map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
        </div>
      </div>
    </div>
  )
}
