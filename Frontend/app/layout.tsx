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
    title: {
      default: "Pippu - DeFi Lending Protocol on Base",
      template: "%s | Pippu - DeFi Lending"
    },
    description: "Pippu is a cute and friendly DeFi lending protocol on Base chain. Supply crypto assets and earn competitive APY, or borrow against your collateral. Safe, transparent, and user-friendly decentralized finance platform. Also known as Pippu Finance, Pippu DeFi, and Finance Base.",
    keywords: [
      "DeFi", "lending protocol", "borrowing", "Base chain", "crypto", "yield farming",
      "APY", "Pippu", "decentralized finance", "crypto lending", "borrow crypto",
      "earn interest crypto", "Base blockchain", "Ethereum L2", "DeFi platform",
      "crypto savings", "collateralized loans", "flash loans", "liquidity mining",
      "pippu finance", "finance base", "pippu base", "pipu defi", "pipu base", "pipu finance",
      "Pippu DeFi", "Base DeFi", "Base lending", "Base borrowing", "DeFi Base chain"
    ],
    authors: [{ name: "Pippu Team" }],
    creator: "Pippu",
    publisher: "Pippu",
    metadataBase: new URL(baseUrl),
    icons: {
      icon: '/icon.ico',
      shortcut: '/icon.ico',
      apple: '/icon.png',
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title: "Pippu - DeFi Lending Protocol on Base",
      description: "Earn competitive APY on your crypto assets with Pippu - the cutest DeFi lending protocol on Base chain. Supply, borrow, and grow your digital assets safely. Also known as Pippu Finance and Finance Base.",
      siteName: "Pippu",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Pippu - DeFi Lending Protocol on Base Chain",
        },
        {
          url: `${baseUrl}/image.png`,
          width: 800,
          height: 800,
          alt: "Pippu Mascot - DeFi Protocol",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Pippu - DeFi Lending Protocol on Base 🐷",
      description: "The cutest way to earn yield in DeFi! Supply assets, earn competitive APY, or borrow against your collateral on Base chain. Pippu Finance, Finance Base, Base DeFi. #DeFi #Base #CryptoYield #PippuDeFi",
      images: [`${baseUrl}/og-image.png`],
      creator: "@PippuDeFi", // Update with actual Twitter handle
      site: "@PippuDeFi", // Update with actual Twitter handle
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
      google: "IY8Xb4_eoQKRocnBkwp5APtE3iaI7p8TG_yjCC7i5JE",
    },
    other: {
      'fc:frame': JSON.stringify({
        version: 'vNext',
        imageUrl: `${baseUrl}/image.png`,
        button: {
          title: 'Pippu\'it',
          action: {
            type: 'launch_frame',
            url: baseUrl,
          },
        },
      }),
      // Structured Data for SEO
      'application/ld+json': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "Pippu - DeFi Lending Protocol",
        "alternateName": ["Pippu Finance", "Pippu DeFi", "Finance Base", "Pippu Base", "Pipu DeFi", "Pipu Base", "Pipu Finance"],
        "description": "Cute and friendly DeFi lending protocol on Base. Supply assets and earn interest, or borrow against your collateral. Also known as Pippu Finance and Finance Base.",
        "url": baseUrl,
        "logo": [
          {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`,
            "width": 400,
            "height": 400,
            "caption": "Pippu - DeFi Lending Protocol Logo"
          },
          {
            "@type": "ImageObject",
            "url": `${baseUrl}/icon.png`,
            "width": 512,
            "height": 512,
            "caption": "Pippu Icon"
          }
        ],
        "image": `${baseUrl}/og-image.png`,
        "provider": {
          "@type": "Organization",
          "name": "Pippu Team",
          "url": baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`,
            "width": 400,
            "height": 400
          }
        },
        "serviceType": "DeFi Lending and Borrowing",
        "areaServed": "Worldwide",
        "offers": {
          "@type": "Offer",
          "description": "Supply crypto assets and earn competitive APY, or borrow against your collateral",
          "category": "Decentralized Finance"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Blockchain",
            "value": "Base"
          },
          {
            "@type": "PropertyValue",
            "name": "Protocol Type",
            "value": "Lending Protocol"
          },
          {
            "@type": "PropertyValue",
            "name": "Features",
            "value": "Supply, Borrow, Earn Interest"
          }
        ]
      }),
      // Organization structured data
      'organization/ld+json': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Pippu",
        "alternateName": ["Pippu DeFi", "Pippu Finance", "Finance Base", "Pippu Base", "Pipu DeFi", "Pipu Base", "Pipu Finance"],
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
          "width": 400,
          "height": 400
        },
        "description": "Cute and friendly DeFi lending protocol on Base chain",
        "sameAs": [
          // Add your social media links here
          // "https://twitter.com/PippuDeFi",
          // "https://github.com/PippuDeFi",
          // "https://discord.gg/pippu"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service"
        }
      })
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
