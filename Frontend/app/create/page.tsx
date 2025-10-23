import { CreatePoolForm } from "@/components/create/create-pool-form"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { DashboardHeader } from "@/components/dashboard/header"

export default function CreatePage() {
  return (
    <LayoutWrapper>
      <div className="w-full max-w-md mx-auto px-4 pt-6 pb-4">
        {/* Page Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-heading mb-2">
            Create Pool
          </h1>
          <p className="text-sm text-neutral-600">
            Lock ETH as collateral and get funded
          </p>
        </div>

        {/* Create Pool Form */}
        <CreatePoolForm />

        {/* Information Cards */}
        <div className="grid grid-cols-1 gap-3 mt-6">
          <div className="card-glass p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-purple-600">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold text-heading text-sm mb-1">Lock Collateral</h3>
                <p className="text-xs text-neutral-600">
                  Deposit ETH as collateral
                </p>
              </div>
            </div>
          </div>
          <div className="card-glass p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600">💰</span>
              </div>
              <div>
                <h3 className="font-semibold text-heading text-sm mb-1">Get Funded</h3>
                <p className="text-xs text-neutral-600">
                  Investors provide USDC liquidity
                </p>
              </div>
            </div>
          </div>
          <div className="card-glass p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600">📈</span>
              </div>
              <div>
                <h3 className="font-semibold text-heading text-sm mb-1">Borrow Funds</h3>
                <p className="text-xs text-neutral-600">
                  Access up to 70% of collateral value
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}