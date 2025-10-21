"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { BorrowHeader } from "@/components/borrow/header"
import { CollateralCalculator } from "@/components/borrow/collateral-calculator"
import { BorrowForm } from "@/components/borrow/borrow-form"
import { BorrowTerms } from "@/components/borrow/borrow-terms"

export default function BorrowPage() {
  return (
    <LayoutWrapper>
      <div className="w-full max-w-md mx-auto px-4 pt-6 pb-4">
        <BorrowHeader />
        <CollateralCalculator />
        <BorrowForm />
        <BorrowTerms />
      </div>
    </LayoutWrapper>
  )
}
