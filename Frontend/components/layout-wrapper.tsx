import type React from "react"
import { BottomNav } from "./bottom-nav"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {children}
      <BottomNav />
    </div>
  )
}
