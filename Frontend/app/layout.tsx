import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { OnchainProvider } from "@/lib/providers"
import "./globals.css"

import { Fredoka, Caveat, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["700"],
})

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = "https://www.pippu.xyz"

  return {
    title: "Pippu - DeFi Lending Protocol",
    description: "Cute and friendly DeFi lending protocol on Base. Supply assets and earn interest, or borrow against your collateral.",
    keywords: ["DeFi", "lending", "borrowing", "Base", "crypto", "yield", "APY", "Pippu"],
    authors: [{ name: "Pippu Team" }],
    creator: "Pippu",
    publisher: "Pippu",
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title: "Pippu - DeFi Lending Protocol",
      description: "Cute and friendly DeFi lending protocol on Base. Supply assets and earn interest, or borrow against your collateral.",
      siteName: "Pippu",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Pippu - DeFi Lending Protocol",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Pippu - DeFi Lending Protocol",
      description: "Cute and friendly DeFi lending protocol on Base. Supply assets and earn interest, or borrow against your collateral.",
      images: [`${baseUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code",
    },
    other: {
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: `${baseUrl}/embed-image.png`,
        button: {
          title: `Launch Pippu`,
          action: {
            type: 'launch_miniapp',
            name: 'Pippu',
            url: baseUrl,
            splashImageUrl: `${baseUrl}/splash-image.png`,
            splashBackgroundColor: '#3B82F6',
          },
        },
      }),
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${caveat.variable} font-sans antialiased bg-gradient-to-b from-blue-50 to-pink-50`}
      >
        <OnchainProvider>
          {children}
        </OnchainProvider>
        <Analytics />
      </body>
    </html>
  )
}
