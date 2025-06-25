import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"

interface AlignmentToGreenMissionProps {
  content: string
  position?: "after-business-description"
  beforeBlock?: "Gallery"
  className?: string
}

export default function AlignmentToGreenMission({ 
  content, 
  position = "after-business-description",
  beforeBlock = "Gallery",
  className 
}: AlignmentToGreenMissionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Alignment to Green Mission
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {content || "This business is committed to sustainable practices and environmental responsibility, contributing to our collective green mission through innovative solutions and eco-conscious operations."}
        </p>
      </CardContent>
    </Card>
  )
}