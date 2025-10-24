import { type Address, type Hash, createPublicClient, http } from 'viem'
import { baseSepolia } from 'wagmi/chains'

// Create a public client for transaction checking
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
})

/**
 * Manually check transaction status
 * Useful for fallback when useWaitForTransactionReceipt fails
 */
export async function checkTransactionStatus(txHash: Hash): Promise<{
  status: 'success' | 'failed' | 'pending' | 'not_found'
  receipt?: any
  error?: string
}> {
  try {
    // First check if transaction exists
    const transaction = await publicClient.getTransaction({ hash: txHash })

    if (!transaction) {
      return { status: 'not_found', error: 'Transaction not found' }
    }

    // Get transaction receipt
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash })

    if (!receipt) {
      return { status: 'pending' }
    }

    // Check transaction status
    if (receipt.status === 'success') {
      return { status: 'success', receipt }
    } else if (receipt.status === 'reverted') {
      return { status: 'failed', receipt, error: 'Transaction was reverted' }
    } else {
      return { status: 'pending', receipt }
    }
  } catch (error) {
    console.error('Error checking transaction status:', error)
    return {
      status: 'not_found',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Extract pool address from transaction logs
 */
export function extractPoolAddressFromLogs(receipt: any, poolCreatedTopic: string): Address | null {
  if (!receipt?.logs) return null

  const poolCreatedEvent = receipt.logs.find((log: any) =>
    log.topics[0]?.toLowerCase() === poolCreatedTopic.toLowerCase()
  )

  if (poolCreatedEvent?.topics[1]) {
    // Convert hex string to address format
    return `0x${poolCreatedEvent.topics[1].slice(26)}` as Address
  }

  return null
}

/**
 * Format transaction hash for display
 */
export function formatTransactionHash(hash: Hash): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

/**
 * Get explorer URL for transaction
 */
export function getTransactionExplorerUrl(txHash: Hash): string {
  return `https://sepolia.basescan.org/tx/${txHash}`
}

/**
 * Get explorer URL for address
 */
export function getAddressExplorerUrl(address: Address): string {
  return `https://sepolia.basescan.org/address/${address}`
}