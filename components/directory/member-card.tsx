import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Shield, ExternalLink, Heart, Eye } from "lucide-react"
import type { Member } from "@/types"
import { cn } from "@/lib/utils"
import MemberTag from "./member-tag"
import MemberSince from "./member-since"
import IndustryTag from "./industry-tag"

interface MemberCardProps {
  member: Member
  layout?: "grid" | "list"
}

export default function MemberCard({ member, layout = "grid" }: MemberCardProps) {
  const tierColors = {
    Enterprise: "bg-primary text-primary-foreground",
    Premium: "bg-secondary text-secondary-foreground",
    Basic: "bg-accent text-accent-foreground",
  }

  const memberSlug = member.slug || member.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')

  if (layout === "list") {
    return (
      <Card className="border transition-all hover:shadow-lg border-muted-foreground/10 bg-gradient-muted">
        <div className="flex items-center p-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={member.logo || "/placeholder.svg"} alt={`${member.name} logo`} />
            <AvatarFallback className="bg-gradient-primary text-white">{member.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-grow">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <MemberTag
                type={member.featured ? "Featured Member" : "Member"}
                color={member.featured ? "green-accent" : "green-base"}
                icon={member.featured ? "star" : "check"}
              />
              {member.verified && <Shield className="h-4 w-4 text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground">{member.tagline}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {member.location}
              </span>
              <MemberSince
                date={member.memberSince}
                format="Month YYYY"
              />
              <IndustryTag
                category={member.industryCategory}
                position="after-member-since"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {member.businessTags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="ml-4 flex flex-col items-end gap-2">
            <Link href={`/directory/${memberSlug}`}>
              <Button className="shadow-sm">
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </Link>
            <Button variant="outline" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-xl border bg-gradient-muted">
      <CardHeader className="relative h-40 p-0">
        <Image
          src={member.coverImage || "/placeholder.svg"}
          alt={`${member.name} cover image`}
          layout="fill"
          objectFit="cover"
          className="transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {member.featured && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
            <Heart className="mr-1 h-3 w-3" />
            Featured
          </Badge>
        )}
        {member.spotlight && (
          <Badge className={`absolute ${member.featured ? 'top-12' : 'top-3'} left-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg`}>
            <Star className="mr-1 h-3 w-3" />
            Showcase
          </Badge>
        )}
        {member.verified && (
          <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-lg">
            <Shield className="h-4 w-4 text-white" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-4">
          <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
            <AvatarImage src={member.logo || "/placeholder.svg"} alt={`${member.name} logo`} />
            <AvatarFallback className="bg-gradient-primary text-white">{member.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">{member.name}</h3>
          <MemberTag
            type={member.featured ? "Featured Member" : "Member"}
            color={member.featured ? "green-accent" : "green-base"}
            icon={member.featured ? "star" : "check"}
          />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{member.tagline}</p>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {member.location}
          </span>
          <MemberSince
            date={member.memberSince}
            format="Month YYYY"
          />
          <IndustryTag
            category={member.industryCategory}
            position="after-member-since"
          />
        </div>
        <p className="mt-4 text-sm line-clamp-3">{member.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {member.businessTags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              {tag}
            </Badge>
          ))}
          {member.specialties.slice(0, 3).map((spec) => (
            <Badge key={spec} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2 bg-muted/30">
        <Link href={`/directory/${memberSlug}`} className="flex-1">
          <Button className="w-full shadow-sm">
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </Button>
        </Link>
        <Button variant="outline" size="icon">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
