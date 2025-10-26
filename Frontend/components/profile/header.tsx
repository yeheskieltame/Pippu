"use client"

import { useAccount } from 'wagmi';
import { Name } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';

export function ProfileHeader() {
  const { address } = useAccount();

  return (
    <div className="mb-8 animate-fade-in">
      <div className="card-gradient mb-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-blue-300 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg">
          👤
        </div>
        {address ? (
          <>
            <h1 className="text-3xl text-heading mb-1">
              <Name address={address} chain={base} />
            </h1>
            <p
              className="text-sm text-neutral-600 mb-4 break-all"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              {address}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl text-heading mb-1">Not Connected</h1>
            <p
              className="text-sm text-neutral-600 mb-4"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              Please connect your wallet
            </p>
          </>
        )}
        <div className="flex gap-2">
          <div
            className="px-3 py-1 bg-white/50 rounded-full text-xs font-semibold"
            style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
          >
            Member since 2024
          </div>
        </div>
      </div>
    </div>
  )
}
