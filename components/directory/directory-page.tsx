"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Grid, List, Search } from "lucide-react"
import { categories, sampleMembers } from "@/lib/data"
import MemberCard from "./member-card"
import { cn } from "@/lib/utils"

export default function DirectoryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Business Directory</h1>
        <p className="text-muted-foreground">Find and connect with eco-conscious businesses.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or location..." className="pl-8" />
          </div>
          <div className="flex rounded-md border bg-card p-0.5">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          Showing {sampleMembers.length} of {categories[0].count}+ businesses
        </p>
      </div>

      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid" ? "md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
        )}
      >
        {sampleMembers.map((member) => (
          <MemberCard key={member.id} member={member} layout={viewMode} />
        ))}
      </div>
    </div>
  )
}
