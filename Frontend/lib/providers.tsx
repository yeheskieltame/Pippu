"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';

const queryClient = new QueryClient();

// Base Sepolia configuration
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Pippu Lending',
      preference: 'all',
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'Pippu Lending Protocol',
        description: 'Decentralized lending protocol on Base',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: ['https://pippu.com/icon.png'],
      },
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export function OnchainProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          chain={baseSepolia}
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}