export function BorrowHeader() {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-center mb-4">
        <div className="text-6xl">💝</div>
      </div>
      <h1 className="text-5xl text-heading mb-3 text-center">Your Borrowing Pools</h1>
      <p className="text-playful text-gray-600 text-center max-w-2xl mx-auto">
        Manage your collateral and borrow funds against your locked assets. Click on any pool card to see details and take actions.
      </p>

      {/* Quick Stats */}
      <div className="flex justify-center mt-6 space-x-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            70%
          </div>
          <div className="text-sm text-gray-600">Max LTV</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            ETH
          </div>
          <div className="text-sm text-gray-600">Collateral</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            USDC
          </div>
          <div className="text-sm text-gray-600">Borrow</div>
        </div>
      </div>
    </div>
  )
}
