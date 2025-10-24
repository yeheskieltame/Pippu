import type React from "react"
import { BottomNav } from "./bottom-nav"
import { ErrorBoundary } from "./common/error-boundary"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen pb-24 md:pb-0">
        {children}
        <BottomNav />
      </div>
    </ErrorBoundary>
  )
}
