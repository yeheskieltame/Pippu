import { useState, useCallback } from "react"

export interface BaseContractState {
  isLoading: boolean
  error: string | null
  success: boolean
  txHash: string | null
}

export type ContractStep = 'idle' | 'approving' | 'executing' | 'confirming' | 'completed'

export function useContractState(initialState?: Partial<BaseContractState>) {
  const [state, setState] = useState<BaseContractState>({
    isLoading: false,
    error: null,
    success: false,
    txHash: null,
    ...initialState
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false,
      success: false
    }))
  }, [])

  const setSuccess = useCallback((txHash?: string) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: null,
      success: true,
      txHash: txHash || null
    }))
  }, [])

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      success: false,
      txHash: null
    })
  }, [])

  return {
    ...state,
    setLoading,
    setError,
    setSuccess,
    reset
  }
}