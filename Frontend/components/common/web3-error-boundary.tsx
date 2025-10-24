"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Web3ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorType?: 'transaction' | 'network' | 'wallet' | 'unknown'
}

interface Web3ErrorBoundaryProps {
  children: React.ReactNode
  onError?: (error: Error, errorType: string) => void
}

export class Web3ErrorBoundary extends React.Component<Web3ErrorBoundaryProps, Web3ErrorBoundaryState> {
  constructor(props: Web3ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): Web3ErrorBoundaryState {
    // Categorize error type based on error message
    let errorType: 'transaction' | 'network' | 'wallet' | 'unknown' = 'unknown'

    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('transaction') || errorMessage.includes('nonce') || errorMessage.includes('gas')) {
      errorType = 'transaction'
    } else if (errorMessage.includes('network') || errorMessage.includes('rpc') || errorMessage.includes('chain')) {
      errorType = 'network'
    } else if (errorMessage.includes('wallet') || errorMessage.includes('metamask') || errorMessage.includes('connect')) {
      errorType = 'wallet'
    }

    return { hasError: true, error, errorType }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Web3ErrorBoundary caught an error:', error, errorInfo)

    if (this.props.onError) {
      this.props.onError(error, this.state.errorType || 'unknown')
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorType: undefined })
  }

  getErrorMessage = () => {
    const { error, errorType } = this.state

    if (!error) return 'An unexpected error occurred'

    switch (errorType) {
      case 'transaction':
        return 'Transaction failed. Please check your wallet and try again.'
      case 'network':
        return 'Network error. Please check your connection and try again.'
      case 'wallet':
        return 'Wallet connection error. Please ensure your wallet is connected properly.'
      default:
        return error.message || 'An unexpected error occurred'
    }
  }

  getErrorAction = () => {
    const { errorType } = this.state

    switch (errorType) {
      case 'transaction':
        return 'Check transaction details in your wallet'
      case 'network':
        return 'Verify network connection and RPC settings'
      case 'wallet':
        return 'Reconnect your wallet'
      default:
        return 'Try the action again'
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="m-4 p-6 border-orange-200 bg-orange-50">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-orange-900 mb-2">
              Web3 Error
            </h2>

            <p className="text-orange-700 mb-2">
              {this.getErrorMessage()}
            </p>

            <p className="text-orange-600 text-sm mb-4">
              {this.getErrorAction()}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-orange-800 font-medium">
                  Technical Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-orange-100 rounded text-sm">
                  <div className="font-mono text-orange-900">
                    {this.state.error.message}
                  </div>
                  <div className="text-orange-700 mt-1 text-xs">
                    Type: {this.state.errorType}
                  </div>
                </div>
              </details>
            )}

            <div className="flex gap-2 justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </Card>
      )
    }

    return this.props.children
  }
}

// Hook for handling Web3 errors in functional components
export function useWeb3ErrorHandler() {
  const [error, setError] = React.useState<{ error: Error; type: string } | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const handleWeb3Error = React.useCallback((error: Error, type?: string) => {
    console.error('Web3 error caught by useWeb3ErrorHandler:', error, type)

    let errorType = type || 'unknown'
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('transaction') || errorMessage.includes('nonce') || errorMessage.includes('gas')) {
      errorType = 'transaction'
    } else if (errorMessage.includes('network') || errorMessage.includes('rpc') || errorMessage.includes('chain')) {
      errorType = 'network'
    } else if (errorMessage.includes('wallet') || errorMessage.includes('metamask') || errorMessage.includes('connect')) {
      errorType = 'wallet'
    }

    setError({ error, type: errorType })
  }, [])

  return { handleWeb3Error, resetError, error }
}