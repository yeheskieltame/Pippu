"use client"

import { useEffect } from "react"
import { sdk } from '@farcaster/miniapp-sdk'
import { LayoutWrapper } from "@/components/layout-wrapper"
import { DashboardHeader } from "@/components/dashboard/header"
import { PortfolioCard } from "@/components/dashboard/portfolio-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { PoolsOverview } from "@/components/dashboard/pools-overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function Home() {
  useEffect(() => {
    // Initialize MiniApp SDK
    sdk.actions.ready()
  }, [])

  return (
    <LayoutWrapper>
      <div className="w-full max-w-md mx-auto px-4 pt-6 pb-4">
        <DashboardHeader />
        <PortfolioCard />
        <QuickActions />
        <PoolsOverview />
        <RecentActivity />
      </div>
    </LayoutWrapper>
  )
}
