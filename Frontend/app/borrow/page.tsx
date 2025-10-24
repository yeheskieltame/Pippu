"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { BorrowHeader } from "@/components/borrow/header"
import { CollateralCalculator } from "@/components/borrow/collateral-calculator"
import { BorrowFormV2 } from "@/components/borrow/borrow-form-v2"
import { BorrowTerms } from "@/components/borrow/borrow-terms"

export default function BorrowPage() {
  return (
    <LayoutWrapper>
      <div className="w-full max-w-md mx-auto px-4 pt-6 pb-4">
        <BorrowHeader />
        <CollateralCalculator />
        <BorrowFormV2 />
        <BorrowTerms />
      </div>
    </LayoutWrapper>
  )
}
