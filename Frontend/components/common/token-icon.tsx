"use client"

import { useState } from "react"

interface TokenIconProps {
  icon: string
  symbol: string
  color: string
  size?: "small" | "medium" | "large"
  fallback?: string
}

export function TokenIcon({ icon, symbol, color, size = "medium", fallback = "🪙" }: TokenIconProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8"
  }

  const containerClasses = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-12 h-12"
  }

  return (
    <div
      className={`${containerClasses[size]} rounded-full flex items-center justify-center`}
      style={{ backgroundColor: `${color}20` }}
    >
      {!imageError ? (
        <img
          src={icon}
          alt={symbol}
          className={`${sizeClasses[size]} rounded-full`}
          onError={() => setImageError(true)}
        />
      ) : (
        <span className={`${size === "small" ? "text-sm" : size === "large" ? "text-2xl" : "text-lg"}`}>
          {fallback}
        </span>
      )}
    </div>
  )
}