"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { ProfileHeader } from "@/components/profile/header"
import { UserStats } from "@/components/profile/user-stats"
import { FaucetCard } from "@/components/profile/faucet-card"
import { AccountSettings } from "@/components/profile/account-settings"
import { SecuritySettings } from "@/components/profile/security-settings"
import { ProfileActions } from "@/components/profile/profile-actions"

export default function ProfilePage() {
  return (
    <LayoutWrapper>
      <div className="w-full max-w-md mx-auto px-4 pt-6 pb-4">
        <ProfileHeader />
        <UserStats />
        <FaucetCard />
        <AccountSettings />
        <SecuritySettings />
        <ProfileActions />
      </div>
    </LayoutWrapper>
  )
}
