import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Member } from "@/types" // Use the existing Member type
import { cn } from "@/lib/utils"
import MemberTag from "@/components/directory/member-tag"
import MemberSince from "@/components/directory/member-since"
import IndustryTag from "@/components/directory/industry-tag"

interface ShowcaseMemberCardProps {
  member: Member
}

export default function ShowcaseMemberCard({ member }: ShowcaseMemberCardProps) {
  const tierColors = {
    Enterprise: "bg-primary text-primary-foreground",
    Premium: "bg-secondary text-secondary-foreground",
    Basic: "bg-accent text-accent-foreground",
  }

  // Create slug from member name
  const createSlug = (name: string) => 
    name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

  return (
    <Link href={`/directory/${createSlug(member.name)}`}>
      <Card className="overflow-hidden transition-all hover:shadow-xl hover:scale-105 cursor-pointer">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-6">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
          <Image
            src={member.logo || "/placeholder.svg?width=64&height=64"}
            alt={`${member.name} logo`}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-primary">{member.name}</CardTitle>
            <MemberTag
              type={member.featured ? "Featured Member" : "Member"}
              color={member.featured ? "green-accent" : "green-base"}
              icon={member.featured ? "star" : "check"}
              className="text-xs"
            />
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{member.location}</span>
          </div>
          <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
            <MemberSince
              date={member.memberSince}
              format="Month YYYY"
            />
            <IndustryTag
              category={member.industryCategory}
              position="after-member-since"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="text-sm text-muted-foreground">{member.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {member.businessTags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-4 rounded-md bg-muted p-3 text-xs font-medium text-primary">{member.category}</div>
      </CardContent>
    </Card>
    </Link>
  )
}
