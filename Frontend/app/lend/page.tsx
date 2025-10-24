"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { LendHeader } from "@/components/lend/header"
import { TVLOverview } from "@/components/lend/tvl-overview"
import { PoolsList } from "@/components/lend/pools-list"
import { LendFormV2 } from "@/components/lend/lend-form-v2"

export default function LendPage() {
  return (
    <LayoutWrapper>
      <div className="w-full max-w-md mx-auto px-4 pt-6 pb-4">
        <LendHeader />
        <TVLOverview />
        <PoolsList />
        <LendFormV2 />
      </div>
    </LayoutWrapper>
  )
}
