"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function JoinPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to membership page since they are now merged
    router.replace('/membership')
  }, [router])

  return null
}