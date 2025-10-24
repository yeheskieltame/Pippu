"use client"

import { useState, useEffect } from "react"
import { X, Sparkles, Heart, Star, BookOpen, CheckCircle } from "lucide-react"

interface TransactionSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  transactionType: 'approve' | 'fund' | 'withdraw'
  transactionHash: string
  amount?: string
  poolName?: string
}

export function TransactionSuccessModal({
  isOpen,
  onClose,
  transactionType,
  transactionHash,
  amount,
  poolName
}: TransactionSuccessModalProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  useEffect(() => {
    // Reset showDetails when modal opens
    if (isOpen) {
      setShowDetails(false)
    }
  }, [isOpen])

  if (!isOpen || !isMounted) return null

  const getTransactionMessage = () => {
    switch (transactionType) {
      case 'approve':
        return {
          title: "Token Approved! 🎉",
          message: "Your tokens have been successfully approved for lending.",
          emoji: "✨"
        }
      case 'fund':
        return {
          title: "Lending Successful! 💕",
          message: `Your ${amount || ''} tokens have been successfully lent to ${poolName || 'the pool'}.`,
          emoji: "📚"
        }
      case 'withdraw':
        return {
          title: "Withdrawal Complete! 🌟",
          message: `Your ${amount || ''} tokens have been successfully withdrawn.`,
          emoji: "💝"
        }
      default:
        return {
          title: "Transaction Complete! 🎊",
          message: "Your transaction has been successfully processed.",
          emoji: "⭐"
        }
    }
  }

  const { title, message, emoji } = getTransactionMessage()

  const formatTransactionHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`
  }

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Book-style container with pink gradient */}
        <div className="bg-linear-to-br from-pink-100 via-pink-50 to-purple-50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-4 border-pink-200">

          {/* Book spine decoration */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-linear-to-b from-pink-300 to-pink-400"></div>

          {/* Decorative sparkles */}
          <div className="absolute top-4 right-4 text-pink-400 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute top-8 right-12 text-purple-400 animate-bounce">
            <Star className="w-4 h-4" />
          </div>
          <div className="absolute bottom-4 left-8 text-pink-400 animate-pulse">
            <Heart className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="p-8 pl-10">
            {/* Close button */}
            <button
              onClick={onClose}
              type="button"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors group"
            >
              <X className="w-4 h-4 text-pink-600 group-hover:text-pink-800" />
            </button>

            {/* Success icon and message */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce">{emoji}</div>
              <h2 className="text-2xl font-bold text-pink-800 mb-2">{title}</h2>
              <p className="text-pink-600 text-sm leading-relaxed">{message}</p>
            </div>

            {/* Success checkmark */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Transaction details toggle */}
            <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm border-2 border-pink-200">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between text-pink-700 hover:text-pink-900 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium text-sm">Transaction Details</span>
                </div>
                <span className="text-xs text-pink-500">
                  {showDetails ? 'Hide' : 'Show'}
                </span>
              </button>

              {showDetails && (
                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-pink-100">
                    <span className="text-pink-600">Transaction Hash:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-pink-100 px-2 py-1 rounded text-pink-800">
                        {formatTransactionHash(transactionHash)}
                      </code>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-pink-100">
                    <span className="text-pink-600">Status:</span>
                    <span className="text-green-600 font-medium">✓ Confirmed</span>
                  </div>

                  {amount && (
                    <div className="flex justify-between items-center py-2 border-b border-pink-100">
                      <span className="text-pink-600">Amount:</span>
                      <span className="font-medium text-pink-800">{amount}</span>
                    </div>
                  )}

                  {poolName && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-pink-600">Pool:</span>
                      <span className="font-medium text-pink-800">{poolName}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  // Copy transaction hash to clipboard
                  navigator.clipboard.writeText(transactionHash)
                }}
                className="flex-1 bg-pink-200 hover:bg-pink-300 text-pink-800 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Copy Hash
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-linear-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                Done
              </button>
            </div>
          </div>

          {/* Bottom decorative border */}
          <div className="h-2 bg-linear-to-r from-pink-300 via-purple-300 to-pink-300"></div>
        </div>
      </div>
    </div>
  )
}