"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { formatCurrency } from "@/lib/utils/format"

export function CreatePoolForm() {
  const { isConnected, address } = useAccount()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    collateralAsset: "ETH",
    loanAsset: "USDC",
    collateralAmount: 1,
    loanAmountRequested: 2000,
    interestRate: 12, // 12% annually
    loanDuration: 30, // 30 days
    riskLevel: "Medium" as "Low" | "Medium" | "High"
  })

  // ETH price assumption for MVP
  const ETH_PRICE = 3835.61
  const MAX_LTV = 0.7 // 70%

  const collateralValue = formData.collateralAmount * ETH_PRICE
  const maxLoanAmount = collateralValue * MAX_LTV
  const isValidLoanAmount = formData.loanAmountRequested <= maxLoanAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement contract call to create pool
    console.log("Creating pool with data:", formData)
  }

  if (!isConnected) {
    return (
      <div className="card-glass animate-bounce-in p-6" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-2xl text-heading mb-4">Create Borrowing Pool</h3>
        <p className="text-center text-neutral-600">Please connect your wallet to create a pool</p>
      </div>
    )
  }

  return (
    <div className="card-glass animate-bounce-in" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-2xl text-heading mb-6">Create Borrowing Pool</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pool Information */}
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Pool Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              placeholder="e.g., My Home Renovation Loan"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
              placeholder="Describe the purpose of your loan..."
              rows={3}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Risk Level
            </label>
            <select
              value={formData.riskLevel}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                riskLevel: e.target.value as "Low" | "Medium" | "High"
              }))}
              className="w-full px-4 py-3 bg-white/50 rounded-2xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>

        {/* Collateral Information */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-200">
          <h4
            className="text-sm font-semibold text-purple-900 mb-4"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Collateral Information
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-purple-800 mb-1">Collateral Asset</label>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">ETH</span>
                </div>
                <span className="text-sm font-medium text-purple-900">Ethereum (ETH)</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-purple-800 mb-1">Collateral Amount</label>
              <input
                type="number"
                value={formData.collateralAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, collateralAmount: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white/70 rounded-xl border border-purple-200 focus:border-purple-400 focus:outline-none"
                min="0.1"
                step="0.1"
                required
              />
            </div>
            <div className="text-xs text-purple-800">
              Collateral Value: {formatCurrency(collateralValue)}
            </div>
          </div>
        </div>

        {/* Loan Terms */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
          <h4
            className="text-sm font-semibold text-green-900 mb-4"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Loan Terms
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-green-800 mb-1">Loan Amount (USDC)</label>
              <input
                type="number"
                value={formData.loanAmountRequested}
                onChange={(e) => setFormData(prev => ({ ...prev, loanAmountRequested: Number(e.target.value) }))}
                className={`w-full px-3 py-2 bg-white/70 rounded-xl border ${
                  isValidLoanAmount ? 'border-green-200' : 'border-red-300 focus:border-red-400'
                } focus:outline-none`}
                min="100"
                max={maxLoanAmount}
                required
              />
              {!isValidLoanAmount && (
                <p className="text-xs text-red-600 mt-1">
                  Maximum: {formatCurrency(maxLoanAmount)} (70% of collateral)
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs text-green-800 mb-1">Interest Rate (Annual)</label>
              <input
                type="number"
                value={formData.interestRate}
                onChange={(e) => setFormData(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white/70 rounded-xl border border-green-200 focus:border-green-400 focus:outline-none"
                min="1"
                max="20"
                step="0.1"
                required
              />
              <span className="text-xs text-green-800">{formData.interestRate}% per year</span>
            </div>
            <div>
              <label className="block text-xs text-green-800 mb-1">Loan Duration</label>
              <select
                value={formData.loanDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, loanDuration: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white/70 rounded-xl border border-green-200 focus:border-green-400 focus:outline-none"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <h4
            className="text-sm font-semibold text-blue-900 mb-3"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Pool Summary
          </h4>
          <div className="space-y-2 text-sm" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            <div className="flex justify-between">
              <span className="text-blue-800">Collateral:</span>
              <span className="font-bold text-blue-600">
                {formData.collateralAmount} ETH ({formatCurrency(collateralValue)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Loan Amount:</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(formData.loanAmountRequested)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">LTV Ratio:</span>
              <span className="font-bold text-blue-600">
                {((formData.loanAmountRequested / collateralValue) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Interest Rate:</span>
              <span className="font-bold text-blue-600">{formData.interestRate}% APY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Total Repayment:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(formData.loanAmountRequested * (1 + (formData.interestRate / 100) * (formData.loanDuration / 365)))}
              </span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
          <h4
            className="text-xs font-semibold text-yellow-900 mb-2"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Important Terms
          </h4>
          <ul className="text-xs text-yellow-800 space-y-1" style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}>
            <li>• Your ETH will be locked as collateral until loan repayment</li>
            <li>• Maximum loan is 70% of collateral value</li>
            <li>• Interest accrues daily based on annual rate</li>
            <li>• Late payments may result in collateral liquidation</li>
            <li>• Pool must be funded by investors before you can borrow</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={!isValidLoanAmount || !formData.name || !formData.description}
        >
          {!isValidLoanAmount ? 'Adjust Loan Amount' :
           !formData.name ? 'Enter Pool Name' :
           !formData.description ? 'Enter Description' :
           'Create Pool & Lock Collateral'}
        </button>
      </form>
    </div>
  )
}