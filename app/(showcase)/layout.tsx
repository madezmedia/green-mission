import type React from "react"

export default function ShowcaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="flex min-h-screen flex-col">{children}</div>
}
