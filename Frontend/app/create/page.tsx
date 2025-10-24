import { CreatePoolForm } from "@/components/create/create-pool-form"
import { LayoutWrapper } from "@/components/layout-wrapper"

export default function CreatePage() {
  return (
    <LayoutWrapper>
      <div className="w-full max-w-md mx-auto px-4 pt-6 pb-4">
        {/* Create Pool Form */}
        <CreatePoolForm />
      </div>
    </LayoutWrapper>
  )
}