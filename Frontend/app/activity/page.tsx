"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { ActivityHeader } from "@/components/activity/header"
import { ActivityFilters } from "@/components/activity/filters"
import { ActivityTimeline } from "@/components/activity/timeline"
import { ActivityStats } from "@/components/activity/stats"

export default function ActivityPage() {
  return (
    <LayoutWrapper>
      <div className="w-full max-w-md mx-auto px-4 pt-6 pb-4">
        <ActivityHeader />
        <ActivityStats />
        <ActivityFilters />
        <ActivityTimeline />
      </div>
    </LayoutWrapper>
  )
}
