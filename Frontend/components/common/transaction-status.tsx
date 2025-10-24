import { BaseContractState } from "@/lib/hooks/useContractState"

interface TransactionStatusProps {
  state: BaseContractState
  title?: string
  loadingMessage?: string
  successMessage?: string
  onReset?: () => void
}

export function TransactionStatus({
  state,
  title,
  loadingMessage = "Processing transaction...",
  successMessage = "Transaction completed successfully!",
  onReset
}: TransactionStatusProps) {
  if (state.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Error:</span> {state.error}
            </p>
            {state.txHash && (
              <p className="text-xs text-red-600 mt-1">
                Transaction: {state.txHash.slice(0, 10)}...{state.txHash.slice(-8)}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (state.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-green-800 font-medium">
              🎉 {successMessage}
            </p>
            {title && <p className="text-xs text-green-700 mt-1">{title}</p>}
            {state.txHash && (
              <p className="text-xs text-green-600 mt-1">
                Transaction: {state.txHash.slice(0, 10)}...{state.txHash.slice(-8)}
              </p>
            )}
            {onReset && (
              <button
                onClick={onReset}
                className="mt-2 w-full px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                New Transaction
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (state.isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="flex-1">
            <p className="text-sm text-blue-800">{loadingMessage}</p>
            {state.txHash && (
              <p className="text-xs text-blue-600 mt-1">
                Transaction: {state.txHash.slice(0, 10)}...{state.txHash.slice(-8)}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}